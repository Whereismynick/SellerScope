import { Schema, model } from "mongoose"


export type Orders = {
	orderNumber: number
	date: string
	customer: string
	amount: number
	status: "Paid" | "Pending" | "Cancelled"
}

const OrderSchema = new Schema(
	{
		orderNumber: {
			type: Number,
			required: true
		},
		customer: {
			type: String,
			required: true,
			trim: true
		},
		date: {
			type: String,
			required: true
		},
		amount: {
			type: Number,
			required: true,
			min: 0
		},
		status: {
			type: String,
			enum: ["Paid", "Pending", "Cancelled"],
			required: true
		}
	},
	{
		timestamps: true
	}
)

export const OrderModel = model("Order", OrderSchema)