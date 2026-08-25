import { useState } from "react"
import styles from "./Orders.module.css"

type OrderStatus = "Paid" | "Pending" | "Cancelled"
type Order = {
	id: number
	customer: string
	date: string
	amount: number
	status: OrderStatus
}
const orders: Order[] = [
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

const Orders = () => {
	const [search, setSearch] = useState('')
	const [selected, setSelected] = useState("All")
	const searchOrders = orders.filter(order => order.customer.toLowerCase().includes(search.toLowerCase()) && (selected === "All" || order.status === selected))
	const getStatusClass = (status: OrderStatus) => {
		if(status === 'Paid') return styles.paid
		if(status === 'Pending') return styles.pending
		return styles.cancelled
	}
	return (
		<div className={styles.page}>
			<h2 className={styles.title}>Orders</h2>
			<div className={styles.toolbar}>
				<input className={styles.input}
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>
				<select className={styles.select}
					value={selected}
					onChange={e => setSelected(e.target.value)}
				>
					<option value="All">All</option>
					<option value="Paid">Paid</option>
					<option value="Pending">Pending</option>
					<option value="Cancelled">Cancelled</option>
				</select>
			</div>

			<div className={styles.tableCard}>
				<table className={styles.table}>
					<thead>
						<tr>
							<th>Order</th>
							<th>Customer</th>
							<th>Date</th>
							<th>Amount</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{searchOrders.map(order => (
							<tr key={order.id}>
								<td>#{order.id}</td>
								<td>{order.customer}</td>
								<td>{order.date}</td>
								<td>{order.amount} ₽</td>
								<td><span className={`${styles.status} ${getStatusClass(order.status)}`}>{order.status}</span></td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default Orders