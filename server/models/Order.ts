import { Schema, model } from "mongoose"

export type OrderItem = {
	productId: string
	name: string
	quantity: number
	price: number
}

export type Orders = {
	orderNumber: number
	date: string
	customer: string
	amount: number
	status: "Paid" | "Pending" | "Cancelled"
	items: OrderItem[]
}

const OrderItemSchema = new Schema(
	{
		productId: {
			type: String,
			required: true
		},
		name: {
			type: String,
			required: true,
			trim: true
		},
		quantity: {
			type: Number,
			required: true,
			min: 1
		},
		price: {
			type: Number,
			required: true,
			min: 0
		}
	},
	{ _id: false }
)

const OrderSchema = new Schema(
	{
		items: {
			type: [OrderItemSchema],
			default: []
		},
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