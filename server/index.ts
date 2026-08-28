import express from "express"
import cors from "cors"

const app = express()
const PORT = 3001

const products = [
	{ id: 1, name: "iPhone 15 Pro", price: 119900, stock: 24, status: "Active" },
	{ id: 2, name: "MacBook Air M3", price: 149900, stock: 8, status: "Low Stock" },
	{ id: 3, name: "AirPods Pro", price: 24900, stock: 41, status: "Active" },
	{ id: 4, name: "Apple Watch Series 9", price: 42900, stock: 0, status: "Out of Stock" },
	{ id: 5, name: "USB-C Hub", price: 7900, stock: 14, status: "Active" },
	{ id: 6, name: "MacBook Stand", price: 12500, stock: 5, status: "Low Stock" }
]

app.use(cors())
app.use(express.json())

app.get("/api/products", (req, res) => {
	res.json(products)
})

app.get("/api/products/:id", (req, res) => {
	const id = Number(req.params.id)

	const findProduct = products.find(product => product.id === id)

	if (!findProduct) {
		return res.status(404).json({ message: "Product not found" })
	}

	res.json(findProduct)
})

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})