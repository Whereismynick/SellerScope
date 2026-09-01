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

app.get("/api/orders", (req, res) => {
	res.json(orders)
})

app.get("/api/inventory", (req, res) => {
	res.json(inventory)
})

app.post("/api/products", (req, res) => {
	const newProduct = req.body
	const id = products.length + 1
	const product = {
		id,
		...newProduct
	}
	products.push(product)
	return res.status(201).json(product)
})

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})