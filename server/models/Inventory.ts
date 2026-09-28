import { Schema, model } from "mongoose"

export type InventoryItem = {
	name: string
	sku: string
	stock: number
	reserved: number
	productId: string
}

const InventoryItemSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true
		},
		productId: {
			type: Schema.Types.ObjectId,
			ref: "Product",
			required: true,
			index: true
		},
		sku: {
			type: String,
			required: true,
			trim: true
		},
		stock: {
			type: Number,
			required: true,
			min: 0
		},
		reserved: {
			type: Number,
			required: true,
			min: 0
		}
	}, {
	timestamps: true
}
)

export const InventoryItemModel = model("InventoryItem", InventoryItemSchema)