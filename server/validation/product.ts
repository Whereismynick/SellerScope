import { z } from "zod"

export const productCreateSchema = z.object({
	name: z.string().trim().min(1, "Product name is required"),
	price: z.number().min(1, "Price must be greater than 0"),
	stock: z.number().min(0, "Stock cannot be negative"),
	status: z.enum(["Active", "Low Stock", "Out of Stock"])
})

export const productUpdateSchema = productCreateSchema.partial()