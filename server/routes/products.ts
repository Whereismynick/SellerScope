import { Router } from "express"
import mongoose from "mongoose"

import { ProductModel } from "../models/Product"
import { InventoryItemModel } from "../models/Inventory"

import {
	productCreateSchema,
	productUpdateSchema
} from "../validation/product"

import { getProductStatus } from "../utils/getProductStatus"

const router = Router()

const createSku = (
	name: string,
	productId: mongoose.Types.ObjectId
) => {
	const prefix =
		name
			.trim()
			.toUpperCase()
			.replace(/[^A-Z0-9А-ЯЁ]/g, "")
			.slice(0, 3) || "PRD"

	const suffix = productId
		.toString()
		.slice(-6)
		.toUpperCase()

	return `${prefix}-${suffix}`
}

router.get("/", async (req, res, next) => {
	try {
		const products = await ProductModel.find({
			userId: req.userId
		})

		return res.json(products)
	} catch (error) {
		next(error)
	}
})

router.get("/:id", async (req, res, next) => {
	try {
		const product = await ProductModel.findOne({
			_id: req.params.id,
			userId: req.userId
		})

		if (!product) {
			return res.status(404).json({
				message: "Product not found"
			})
		}

		return res.json(product)
	} catch (error) {
		next(error)
	}
})

router.post("/", async (req, res, next) => {
	try {
		const validateData =
			productCreateSchema.parse(req.body)

		const product = await ProductModel.create({
			...validateData,
			status: getProductStatus(
				validateData.stock
			),
			userId: req.userId
		})

		const sku = createSku(
			product.name,
			product._id
		)

		try {
			await InventoryItemModel.create({
				productId: product._id,
				name: product.name,
				sku,
				stock: product.stock,
				reserved: 0,
				userId: req.userId
			})
		} catch (error) {
			await ProductModel.findByIdAndDelete(
				product._id
			)

			throw error
		}

		return res.status(201).json(product)
	} catch (error) {
		next(error)
	}
})

router.patch("/:id", async (req, res, next) => {
	try {
		const validateData =
			productUpdateSchema.parse(req.body)

		const product = await ProductModel.findOne({
			_id: req.params.id,
			userId: req.userId
		})

		if (!product) {
			return res.status(404).json({
				message: "Product not found"
			})
		}

		const inventory =
			await InventoryItemModel.findOne({
				productId: product._id,
				userId: req.userId
			})

		if (!inventory) {
			return res.status(409).json({
				message:
					"Inventory item not found for product"
			})
		}

		if (
			validateData.stock !== undefined &&
			validateData.stock < inventory.reserved
		) {
			return res.status(400).json({
				message:
					"Stock cannot be lower than reserved quantity"
			})
		}

		const updateData = {
			...validateData,
			...(validateData.stock !== undefined && {
				status: getProductStatus(
					validateData.stock,
					inventory.reserved
				)
			})
		}

		const updatedProduct =
			await ProductModel.findOneAndUpdate(
				{
					_id: product._id,
					userId: req.userId
				},
				updateData,
				{
					returnDocument: "after",
					runValidators: true
				}
			)

		if (!updatedProduct) {
			return res.status(404).json({
				message: "Product not found"
			})
		}

		inventory.name = updatedProduct.name
		inventory.stock = updatedProduct.stock

		await inventory.save()

		return res.json(updatedProduct)
	} catch (error) {
		next(error)
	}
})

router.delete("/:id", async (req, res, next) => {
	try {
		const product = await ProductModel.findOne({
			_id: req.params.id,
			userId: req.userId
		})

		if (!product) {
			return res.status(404).json({
				message: "Product not found"
			})
		}

		const inventory =
			await InventoryItemModel.findOne({
				productId: product._id,
				userId: req.userId
			})

		if (
			inventory &&
			inventory.reserved > 0
		) {
			return res.status(400).json({
				message:
					"Cannot delete a product with reserved stock"
			})
		}

		await InventoryItemModel.findOneAndDelete({
			productId: product._id,
			userId: req.userId
		})

		await ProductModel.deleteOne({
			_id: product._id,
			userId: req.userId
		})

		return res.json({
			message: "Product deleted"
		})
	} catch (error) {
		next(error)
	}
})

export default router