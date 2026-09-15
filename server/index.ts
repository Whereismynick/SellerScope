import mongoose from "mongoose"
import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import bcrypt from "bcryptjs"
import { ProductModel } from "./models/Product"
import { OrderModel } from "./models/Order"
import { InventoryItemModel } from "./models/Inventory"
import type { Request, Response, NextFunction } from "express"
import { ZodError } from "zod"
import { productCreateSchema, productUpdateSchema } from "./validation/product"
import { orderCreateSchema, orderUpdateSchema } from "./validation/order"
import { inventoryCreateSchema, inventoryUpdateSchema } from "./validation/inventory"
import { UserModel } from "./models/User"
import { loginSchema, registerSchema } from "./validation/auth"
import jwt from "jsonwebtoken"
import { authMiddleware } from "./middleware/auth"

const app = express()
const PORT = 3001
dotenv.config()
const MONGODB_URI = process.env.MONGODB_URI
const JWT_SECRET = process.env.JWT_SECRET

app.use(cors())
app.use(express.json())

app.post("/api/auth/register", async (req, res, next) => {
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
		const passwordHash = await bcrypt.hash(validateData.password, 10)
		const user = await UserModel.create({
			name: validateData.name,
			email: validateData.email,
			passwordHash
		})

		if (!JWT_SECRET) {
			throw new Error("JWT_SECRET is not defined")
		}

		const token = jwt.sign(
			{ userId: user._id },
			JWT_SECRET,
			{ expiresIn: "7d" }
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

app.post("/api/auth/login", async (req, res, next) => {
	try {
		const validateData = loginSchema.parse(req.body)
		const findUser = await UserModel.findOne({
			email: validateData.email
		})

		if (!findUser) {
			return res.status(401).json({
				message: "Invalid email or password"
			})
		}

		const isPasswordValid = await bcrypt.compare(
			validateData.password,
			findUser.passwordHash
		)
		if (!isPasswordValid) {
			return res.status(401).json({
				message: "Invalid email or password"
			})
		}

		if (!JWT_SECRET) {
			throw new Error("JWT_SECRET is not defined")
		}

		const token = jwt.sign(
			{ userId: findUser._id },
			JWT_SECRET,
			{ expiresIn: "7d" }
		)

		return res.json({
			_id: findUser._id,
			name: findUser.name,
			email: findUser.email,
			token
		})
	} catch (error) {
		next(error)
	}
})

app.use(authMiddleware)

app.get("/api/products", async (req, res, next) => {
	try {
		const productsFromDb = await ProductModel.find()
		res.json(productsFromDb)
	} catch (error) {
		next(error)
	}
})

app.get("/api/products/:id", async (req, res, next) => {
	try {
		const findProduct = await ProductModel.findById(req.params.id)
		if (!findProduct) {
			return res.status(404).json({ message: "Product not found" })
		}

		res.json(findProduct)
	} catch (error) {
		next(error)
	}
})

app.get("/api/orders", async (req, res, next) => {
	try {
		const ordersFromDb = await OrderModel.find()
		res.json(ordersFromDb)
	} catch (error) {
		next(error)
	}
})

app.get("/api/inventory", async (req, res, next) => {
	try {
		const inventoryFromDb = await InventoryItemModel.find()
		res.json(inventoryFromDb)
	} catch (error) {
		next(error)
	}
})

app.post("/api/products", async (req, res, next) => {
	try {
		const validatedData = productCreateSchema.parse(req.body)
		const product = await ProductModel.create(validatedData)
		return res.status(201).json(product)
	} catch (error) {
		next(error)
	}
})

app.post("/api/orders", async (req, res, next) => {
	try {
		const validateData = orderCreateSchema.parse(req.body)
		const order = await OrderModel.create(validateData)
		return res.status(201).json(order)
	} catch (error) {
		next(error)
	}
})

app.post("/api/inventory", async (req, res, next) => {
	try {
		const validateData = inventoryCreateSchema.parse(req.body)
		const inventory = await InventoryItemModel.create(validateData)
		return res.status(201).json(inventory)
	} catch (error) {
		next(error)
	}
})

app.delete("/api/products/:id", async (req, res, next) => {
	try {
		const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id)
		if (!deletedProduct) {
			return res.status(404).json({ message: "Product not found" })
		}
		return res.json({ message: "Product deleted" })
	} catch (error) {
		next(error)
	}
})

app.patch("/api/products/:id", async (req, res, next) => {
	try {
		const validateData = productUpdateSchema.parse(req.body)
		const updatedProduct = await ProductModel.findByIdAndUpdate(
			req.params.id,
			validateData,
			{ new: true, runValidators: true }
		)

		if (!updatedProduct) {
			return res.status(404).json({ message: "Product not found" })
		}

		return res.json(updatedProduct)
	} catch (error) {
		next(error)
	}
})

app.patch("/api/orders/:id", async (req, res, next) => {
	try {
		const validateData = orderUpdateSchema.parse(req.body)
		const updatedOrder = await OrderModel.findByIdAndUpdate(
			req.params.id,
			validateData,
			{ new: true, runValidators: true }
		)
		if (!updatedOrder) {
			return res.status(404).json({ message: "Order not found" })
		}

		return res.json(updatedOrder)
	} catch (error) {
		next(error)
	}
})

app.patch("/api/inventory/:id", async (req, res, next) => {
	try {
		const validateData = inventoryUpdateSchema.parse(req.body)
		const updatedInventoryItem = await InventoryItemModel.findByIdAndUpdate(
			req.params.id,
			validateData,
			{ new: true, runValidators: true }
		)
		if (!updatedInventoryItem) {
			return res.status(404).json({ message: "Inventory item not found" })
		}
		return res.json(updatedInventoryItem)
	} catch (error) {
		next(error)
	}
})

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
	if (error instanceof ZodError) {
		return res.status(400).json({
			message: "Validation failed",
			errors: error.issues
		})
	}
	if (error instanceof mongoose.Error.CastError) {
		return res.status(400).json({ message: "Invalid id" })
	}
	if (error instanceof mongoose.Error.ValidationError) {
		return res.status(400).json({ message: "Validation failed" })
	}
	console.error(error)
	return res.status(500).json({ message: "Internal server error" })
})

const startServer = async () => {
	if (!MONGODB_URI) {
		throw new Error("MONGODB_URI is not defined")
	}

	try {
		await mongoose.connect(MONGODB_URI, {
			dbName: "sellerscope"
		})

		console.log("MongoDB connected")

		app.listen(PORT, () => {
			console.log(`Server running on http://localhost:${PORT}`)
		})
	} catch (error) {
		console.error("Failed to connect to MongoDB", error)
	}
}

startServer()