import express from "express"
import cors from "cors"
import mongoose from "mongoose"

import { authMiddleware } from "./middleware/auth"
import { errorMiddleware } from "./middleware/error"

import authRoutes from "./routes/auth"
import productsRouter from "./routes/products"
import ordersRouter from "./routes/orders"
import inventoryRouter from "./routes/inventory"
import settingsRouter from "./routes/settings"
import {
	FRONTEND_URL,
	MONGODB_URI,
	PORT
} from "./config/env"

const app = express()

app.use(
	cors({
		origin: FRONTEND_URL
	})
)

app.use(express.json())

app.get("/health", (_req, res) => {
	res.status(200).json({
		status: "ok"
	})
})

app.use("/api/auth", authRoutes)

app.use(authMiddleware)

app.use("/api/products", productsRouter)
app.use("/api/orders", ordersRouter)
app.use("/api/inventory", inventoryRouter)
app.use("/api/settings", settingsRouter)

app.use(errorMiddleware)

const startServer = async () => {
	try {
		await mongoose.connect(
			MONGODB_URI,
			{
				dbName: "sellerscope"
			}
		)

		console.log("MongoDB connected")

		app.listen(PORT, () => {
			console.log(
				`Server running on http://localhost:${PORT}`
			)
		})
	} catch (error) {
		console.error(
			"Failed to start server",
			error
		)
	}
}

startServer()