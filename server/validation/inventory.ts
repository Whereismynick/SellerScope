import { z } from "zod"

export const inventoryUpdateSchema = z.object({
	stock: z
	.number()
	.int("Stock must be an integer")
	.min(0, "Stock cannot be negative")
})