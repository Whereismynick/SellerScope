import { z } from "zod"

const orderItemSchema = z.object({
	productId: z.string().trim().min(1, "Product id is required"),
	quantity: z
		.number()
		.int("Quantity must be an integer")
		.min(1, "Quantity must be at least 1")

})

export const orderCreateSchema = z.object({
	customer: z
		.string()
		.trim()
		.min(1, "Customer is required"),

	items: z
		.array(orderItemSchema)
		.min(1, "Order must contain at least one item")
		.refine(
			items =>
				new Set(
					items.map(item => item.productId)
				).size === items.length,
			{
				message:
					"Duplicate products are not allowed"
			}
		)
})

export const orderUpdateSchema = z.object({
	status: z.enum([
		"Paid",
		"Pending",
		"Cancelled"
	])
})