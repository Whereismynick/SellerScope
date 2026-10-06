import { z } from "zod"

export const productCreateSchema = z.object({
	name: z.string().trim().min(1, "Product name is required"),

	price: z
		.number()
		.positive("Price must be greater than 0")
		.multipleOf(0.01, "Price can have at most 2 decimal places"),

	stock: z
		.number()
		.int("Stock must be an integer")
		.min(0, "Stock cannot be negative")
})

export const productUpdateSchema = productCreateSchema.partial()