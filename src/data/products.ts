export type ProductStatus = "Active" | "Low Stock" | "Out of Stock"

export type Product = {
  id: number
  name: string
  price: number
  stock: number
  status: ProductStatus
}

export const products: Product[] = [
  {
		id: 1,
		name: "iPhone 15 Pro",
		price: 119900,
		stock: 24,
		status: "Active"
	},
	{
		id: 2,
		name: "MacBook Air M3",
		price: 149900,
		stock: 8,
		status: "Low Stock"
	},
	{
		id: 3,
		name: "AirPods Pro",
		price: 24900,
		stock: 41,
		status: "Active"
	},
	{
		id: 4,
		name: "Apple Watch Series 9",
		price: 42900,
		stock: 0,
		status: "Out of Stock"
	},
	{
		id: 5,
		name: "USB-C Hub",
		price: 7900,
		stock: 14,
		status: "Active"
	},
	{
		id: 6,
		name: "MacBook Stand",
		price: 12500,
		stock: 5,
		status: "Low Stock"
	}
]