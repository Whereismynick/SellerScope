import { z } from "zod"

export const inventoryUpdateSchema = z.object({
	stock: z
		.number()
		.min(0, "Stock cannot be negative")
})