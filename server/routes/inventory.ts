import { Router } from "express"

import { InventoryItemModel } from "../models/Inventory"
import { ProductModel } from "../models/Product"

import { inventoryUpdateSchema } from "../validation/inventory"
import { getProductStatus } from "../utils/getProductStatus"

const router = Router()

router.get("/", async (req, res, next) => {
	try {
		const inventory =
			await InventoryItemModel.find({
				userId: req.userId
			})

		return res.json(inventory)
	} catch (error) {
		next(error)
	}
})

router.patch("/:id", async (req, res, next) => {
	try {
		const validateData =
			inventoryUpdateSchema.parse(req.body)

		const inventory =
			await InventoryItemModel.findOne({
				_id: req.params.id,
				userId: req.userId
			})

		if (!inventory) {
			return res.status(404).json({
				message: "Inventory item not found"
			})
		}

		if (
			validateData.stock !== undefined &&
			validateData.stock <
			inventory.reserved
		) {
			return res.status(400).json({
				message:
					"Stock cannot be lower than reserved quantity"
			})
		}

		const product = await ProductModel.findOne({
			_id: inventory.productId,
			userId: req.userId
		})

		if (!product) {
			return res.status(409).json({
				message:
					"Product not found for inventory item"
			})
		}

		if (validateData.stock !== undefined) {
			inventory.stock =
				validateData.stock
		}

		await inventory.save()

		product.stock = inventory.stock
		product.status = getProductStatus(inventory.stock)

		await product.save()

		return res.json(inventory)
	} catch (error) {
		next(error)
	}
})

export default router