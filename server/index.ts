import express from "express"
import cors from "cors"
const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.get("/api/products", (req, res) => {
	res.json([
		{ id: 1, name: "iPhone 15 Pro", price: 119900, stock: 24, status: "Active" },
		{ id: 2, name: "MacBook Air M3", price: 149900, stock: 8, status: "Low Stock" },
		{ id: 3, name: "AirPods Pro", price: 24900, stock: 41, status: "Active" }
	])
})

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})