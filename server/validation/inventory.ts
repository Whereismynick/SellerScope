import { z } from "zod"

const inventoryBaseSchema = z.object({
	name: z.string().trim().min(1, "Inventory name is required"),
	sku: z.string().trim().min(1, "SKU is required"),
	stock: z.number().min(0, "Stock cannot be negative"),
	reserved: z.number().min(0, "Reserved cannot be negative")
})

export const inventoryCreateSchema = inventoryBaseSchema.refine(
	(data) => data.reserved <= data.stock,
	{
		message: "Reserved cannot exceed stock",
		path: ["reserved"]
	}
)

export const inventoryUpdateSchema = inventoryBaseSchema.partial()