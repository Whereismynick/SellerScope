import { Router } from "express"

import { UserModel } from "../models/User"
import { settingsUpdateSchema } from "../validation/settings"

const router = Router()

router.get("/", async (req, res, next) => {
	try {
		const user = await UserModel.findById(
			req.userId
		)

		if (!user) {
			return res.status(404).json({
				message: "User not found"
			})
		}

		return res.json({
			name: user.name,
			email: user.email,
			storeName: user.storeName,
			currency: user.currency,
			notifications: user.notifications
		})
	} catch (error) {
		next(error)
	}
})

router.patch("/", async (req, res, next) => {
	try {
		const validateData =
			settingsUpdateSchema.parse(req.body)

		const user =
			await UserModel.findByIdAndUpdate(
				req.userId,
				validateData,
				{
					new: true,
					runValidators: true
				}
			)

		if (!user) {
			return res.status(404).json({
				message: "User not found"
			})
		}

		return res.json({
			name: user.name,
			email: user.email,
			storeName: user.storeName,
			currency: user.currency,
			notifications: user.notifications
		})
	} catch (error) {
		next(error)
	}
})

export default router