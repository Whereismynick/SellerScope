import mongoose from "mongoose"
import { ZodError } from "zod"

import type {
	Request,
	Response,
	NextFunction
} from "express"

export const errorMiddleware = (
	error: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction
) => {
	if (error instanceof ZodError) {
		return res.status(400).json({
			message: "Validation failed",
			errors: error.issues
		})
	}

	if (error instanceof mongoose.Error.CastError) {
		return res.status(400).json({
			message: "Invalid id"
		})
	}

	if (
		error instanceof
		mongoose.Error.ValidationError
	) {
		return res.status(400).json({
			message: "Validation failed"
		})
	}

	console.error(error)

	return res.status(500).json({
		message: "Internal server error"
	})
}