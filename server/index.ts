import mongoose from "mongoose"
import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import { ProductModel } from "./models/Product"

const app = express()
const PORT = 3001
dotenv.config()
const MONGODB_URI = process.env.MONGODB_URI

const orders = [
	{
		id: 1001,
		customer: "Anna Petrova",
		date: "2026-08-18",
		amount: 12900,
		status: "Paid"
	},
	{
		id: 1002,
		customer: "Max Orlov",
		date: "2026-08-18",
		amount: 8400,
		status: "Pending"
	},
	{
		id: 1003,
		customer: "Dmitry Ivanov",
		date: "2026-08-17",
		amount: 21900,
		status: "Paid"
	},
	{
		id: 1004,
		customer: "Olga Smirnova",
		date: "2026-08-17",
		amount: 5600,
		status: "Cancelled"
	},
	{
		id: 1005,
		customer: "Alex Morozov",
		date: "2026-08-16",
		amount: 17400,
		status: "Paid"
	},
	{
		id: 1006,
		customer: "Maria Volkova",
		date: "2026-08-16",
		amount: 9200,
		status: "Pending"
	}
]

const inventory = [
	{ id: 1, name: "iPhone 15 Pro", sku: "APL-IP15P", stock: 24, reserved: 5 },
	{ id: 2, name: "MacBook Air M3", sku: "APL-MBA-M3", stock: 8, reserved: 3 },
	{ id: 3, name: "AirPods Pro", sku: "APL-APP2", stock: 41, reserved: 12 },
	{ id: 4, name: "Apple Watch Series 9", sku: "APL-AW9", stock: 7, reserved: 2 },
	{ id: 5, name: "USB-C Hub", sku: "ACC-USBC-HUB", stock: 14, reserved: 6 },
	{ id: 6, name: "MacBook Stand", sku: "ACC-MB-STAND", stock: 5, reserved: 1 }
]

app.use(cors())
app.use(express.json())

app.get("/api/products", async (req, res) => {
	const productsFromDb = await ProductModel.find()
	res.json(productsFromDb)
})

app.get("/api/products/:id", async (req, res) => {
	const findProduct = await ProductModel.findById(req.params.id)
	if (!findProduct) {
		return res.status(404).json({ message: "Product not found" })
	}

	res.json(findProduct)
})

app.get("/api/orders", (req, res) => {
	res.json(orders)
})

app.get("/api/inventory", (req, res) => {
	res.json(inventory)
})

app.post("/api/products", async (req, res) => {
	const product = await ProductModel.create(req.body)
	return res.status(201).json(product)
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