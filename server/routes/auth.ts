import { Router } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

import { UserModel } from "../models/User"
import {
	loginSchema,
	registerSchema
} from "../validation/auth"
import { JWT_SECRET } from "../config/env"

const router = Router()

router.post("/register", async (req, res, next) => {
	try {
		const validateData = registerSchema.parse(req.body)

		const existingUser = await UserModel.findOne({
			email: validateData.email
		})

		if (existingUser) {
			return res.status(409).json({
				message: "User already exists"
			})
		}

		const passwordHash = await bcrypt.hash(
			validateData.password,
			10
		)

		const user = await UserModel.create({
			name: validateData.name,
			email: validateData.email,
			passwordHash
		})

		const token = jwt.sign(
			{
				userId: user._id
			},
			JWT_SECRET,
			{
				expiresIn: "7d"
			}
		)

		return res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			token
		})
	} catch (error) {
		next(error)
	}
})

router.post("/login", async (req, res, next) => {
	try {
		const validateData = loginSchema.parse(req.body)

		const user = await UserModel.findOne({
			email: validateData.email
		})

		if (!user) {
			return res.status(401).json({
				message: "Invalid email or password"
			})
		}

		const isPasswordValid = await bcrypt.compare(
			validateData.password,
			user.passwordHash
		)

		if (!isPasswordValid) {
			return res.status(401).json({
				message: "Invalid email or password"
			})
		}

		const token = jwt.sign(
			{
				userId: user._id
			},
			JWT_SECRET,
			{
				expiresIn: "7d"
			}
		)

		return res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			token
		})
	} catch (error) {
		next(error)
	}
})

export default router