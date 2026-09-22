import { Schema, model } from "mongoose";

const UserSchema = new Schema (
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		storeName: {
			type: String,
			default: "SellerScope Store",
			trim: true
		},
		currency: {
			type: String,
			enum: ["RUB", "USD", "EUR"],
			default: "RUB"
		},
		notifications: {
			type: Boolean,
			default: true
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true

		},
		passwordHash: {
			type: String,
			required: true
		},
	},
	{
		timestamps: true
	}
)

export const UserModel = model("User", UserSchema)