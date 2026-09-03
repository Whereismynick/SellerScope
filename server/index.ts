import mongoose from "mongoose"
import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import { ProductModel } from "./models/Product"
import { OrderModel } from "./models/Order"
import { InventoryItemModel } from "./models/Inventory"

const app = express()
const PORT = 3001
dotenv.config()
const MONGODB_URI = process.env.MONGODB_URI

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

app.get("/api/orders", async (req, res) => {
	const ordersFromDb = await OrderModel.find()
	res.json(ordersFromDb)
})

app.get("/api/inventory", async (req, res) => {
	const inventoryFromDb = await InventoryItemModel.find()
	res.json(inventoryFromDb)
})

app.post("/api/products", async (req, res) => {
	const product = await ProductModel.create(req.body)
	return res.status(201).json(product)
})

app.post("/api/orders", async (req, res) => {
	const order = await OrderModel.create(req.body)
	return res.status(201).json(order)
})

app.post("/api/inventory", async (req, res) => {
	const inventory = await InventoryItemModel.create(req.body)
	return res.status(201).json(inventory)
})

app.delete("/api/products/:id", async (req, res) => {
	const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id)
	if(!deletedProduct){
		return res.status(404).json({ message: "Product not found" })
	}
	return res.json({ message: "Product deleted" })
})

app.patch("/api/products/:id", async (req, res) => {
	const updatedProduct = await ProductModel.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true, runValidators: true }
	)

	if(!updatedProduct){
		return res.status(404).json({ message: "Product not found" })
	}

	return res.json(updatedProduct)
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