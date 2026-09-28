import { Router } from "express"

import { OrderModel } from "../models/Order"
import { InventoryItemModel } from "../models/Inventory"
import { ProductModel } from "../models/Product"

import {
	orderCreateSchema,
	orderUpdateSchema
} from "../validation/order"

const router = Router()

router.get("/", async (req, res, next) => {
	try {
		const orders = await OrderModel.find({
			userId: req.userId
		})

		return res.json(orders)
	} catch (error) {
		next(error)
	}
})

router.post("/", async (req, res, next) => {
	try {
		const validateData =
			orderCreateSchema.parse(req.body)

		const inventories = []

		for (const item of validateData.items) {
			const inventory =
				await InventoryItemModel.findOne({
					userId: req.userId,
					productId: item.productId
				})

			if (!inventory) {
				return res.status(400).json({
					message:
						`Inventory not found for product ${item.productId}`
				})
			}

			const available =
				inventory.stock -
				inventory.reserved

			if (item.quantity > available) {
				return res.status(400).json({
					message:
						`Not enough stock for product ${item.productId}`
				})
			}

			inventories.push({
				inventory,
				quantity: item.quantity
			})
		}

		for (const item of inventories) {
			item.inventory.reserved +=
				item.quantity

			await item.inventory.save()
		}

		const lastOrder = await OrderModel
			.findOne({
				userId: req.userId
			})
			.sort({
				orderNumber: -1
			})

		const orderNumber = lastOrder
			? lastOrder.orderNumber + 1
			: 1

		const order = await OrderModel.create({
			...validateData,
			date: new Date().toISOString(),
			orderNumber,
			userId: req.userId
		})

		return res.status(201).json(order)
	} catch (error) {
		next(error)
	}
})

router.patch("/:id", async (req, res, next) => {
	try {
		const validateData =
			orderUpdateSchema.parse(req.body)

		const newStatus = validateData.status

		if (!newStatus) {
			return res.status(400).json({
				message: "Order status is required"
			})
		}

		const order = await OrderModel.findOne({
			_id: req.params.id,
			userId: req.userId
		})

		if (!order) {
			return res.status(404).json({
				message: "Order not found"
			})
		}

		if (order.status === newStatus) {
			return res.json(order)
		}

		if (order.status !== "Pending") {
			return res.status(400).json({
				message:
					"Only pending orders can change status"
			})
		}

		const inventories = []

		for (const item of order.items) {
			const inventory =
				await InventoryItemModel.findOne({
					userId: req.userId,
					productId: item.productId
				})

			if (!inventory) {
				return res.status(400).json({
					message:
						`Inventory not found for product ${item.productId}`
				})
			}

			if (
				inventory.reserved <
				item.quantity
			) {
				return res.status(400).json({
					message:
						`Invalid reserved quantity for product ${item.productId}`
				})
			}

			if (
				newStatus === "Paid" &&
				inventory.stock <
				item.quantity
			) {
				return res.status(400).json({
					message:
						`Not enough stock for product ${item.productId}`
				})
			}

			inventories.push({
				inventory,
				quantity: item.quantity
			})
		}

		for (const item of inventories) {
			if (newStatus === "Paid") {
				item.inventory.stock -=
					item.quantity

				item.inventory.reserved -=
					item.quantity
			}

			if (newStatus === "Cancelled") {
				item.inventory.reserved -=
					item.quantity
			}

			await item.inventory.save()

			if (newStatus === "Paid") {
				await ProductModel.findOneAndUpdate(
					{
						_id: item.inventory.productId,
						userId: req.userId
					},
					{
						stock: item.inventory.stock
					},
					{
						runValidators: true
					}
				)
			}
		}

		order.status = newStatus

		await order.save()

		return res.json(order)
	} catch (error) {
		next(error)
	}
})

export default router