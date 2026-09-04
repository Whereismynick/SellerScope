
export type OrderStatus = "Paid" | "Pending" | "Cancelled"
export type OrderItem = {
	productId: string
	name: string
	quantity: number
	price: number
}

export type Order = {
	_id: string
	orderNumber: number
	customer: string
	date: string
	amount: number
	status: OrderStatus
	items: OrderItem[]
}