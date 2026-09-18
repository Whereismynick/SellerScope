import jwt from "jsonwebtoken"
import type { Request, Response, NextFunction } from "express"

type AuthPayload = {
	userId: string
}

export const authMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const authHeader = req.headers.authorization

	if (!authHeader?.startsWith("Bearer ")) {
		return res.status(401).json({ message: "Unauthorized" })
	}

	const token = authHeader.split(" ")[1]
	const JWT_SECRET = process.env.JWT_SECRET

	if (!JWT_SECRET) {
		throw new Error("JWT_SECRET is not defined")
	}

	try {
		const payload = jwt.verify(token, JWT_SECRET) as AuthPayload

		req.userId = payload.userId

		next()
	} catch {
		return res.status(401).json({ message: "Unauthorized" })
	}
}