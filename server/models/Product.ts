import { Schema, model } from "mongoose"

const productSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		price: {
			type: Number,
			required: true,
			min: 1
		},
		stock: {
			type: Number,
			required: true,
			min: 0
		},
		status: {
			type: String,
			enum: ["Active", "Low Stock", "Out of Stock"],
			required: true
		}
	},
	{
		timestamps: true
	}
)

export const ProductModel = model("Product", productSchema)