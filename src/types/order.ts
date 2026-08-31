
export type OrderStatus = "Paid" | "Pending" | "Cancelled"
export type Order = {
	id: number
	customer: string
	date: string
	amount: number
	status: OrderStatus
}