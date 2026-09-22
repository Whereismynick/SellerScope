import { z } from "zod"

export const settingsSchema = z.object({
	name: z.string().trim().min(1, "Name is required"),
	email: z.email("Invalid email"),
	storeName: z.string().trim().min(1, "Store name is required"),
	currency: z.enum(["RUB", "USD", "EUR"], {
		message: "Invalid currency"
	}),
	notifications: z.boolean({
		message: "Notifications must be true or false"
	})
})

export const settingsUpdateSchema = settingsSchema.partial()