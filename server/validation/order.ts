import { z } from "zod"

const orderItemSchema = z.object({
	productId: z.string().trim().min(1, "Product id is required"),
	name: z.string().trim().min(1, "Product name is required"),
	quantity: z.number().min(1, "Quantity must be at least 1"),
	price: z.number().min(0, "Price cannot be negative")
})

export const orderCreateSchema = z.object({
	orderNumber: z.number().min(1, "Order number must be greater than 0"),
	customer: z.string().trim().min(1, "Customer is required"),
	date: z.string().trim().min(1, "Date is required"),
	amount: z.number().min(0, "Amount cannot be negative"),
	status: z.enum(["Paid", "Pending", "Cancelled"]),
	items: z.array(orderItemSchema).min(1, "Order must contain at least one item")
})

export const orderUpdateSchema = orderCreateSchema.partial()