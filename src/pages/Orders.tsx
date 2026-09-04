import { useState } from "react"
import styles from "./Orders.module.css"
import { useQuery } from "@tanstack/react-query"
import type { Order, OrderStatus } from "../types/order"

const fetchOrders = async (): Promise<Order[]> => {
	const response = await fetch(`http://localhost:3001/api/orders`)
	if (!response.ok) throw new Error(`Failed to load orders`)
	const data = await response.json()
	return data
}

const Orders = () => {
	const [search, setSearch] = useState('')
	const [selected, setSelected] = useState("All")

	const getStatusClass = (status: OrderStatus) => {
		if (status === 'Paid') return styles.paid
		if (status === 'Pending') return styles.pending
		return styles.cancelled
	}

	const {
		data: items = [],
		isLoading,
		error,
		refetch
	} = useQuery({
		queryKey: ["orders"],
		queryFn: fetchOrders
	})

	if (isLoading) {
		return <p>Loading orders...</p>
	}

	if (error) {
		return (
			<div>
				<p>{error.message}</p>
				<button onClick={() => refetch()}>Retry</button>
			</div>
		)
	}

	const searchOrders = items.filter(item => item.customer.toLowerCase().includes(search.toLowerCase()) && (selected === "All" || item.status === selected))

	return (
		<div className={styles.page}>
			<div className={styles.toolbar}>
				<input className={styles.input}
					value={search}
					onChange={e => setSearch(e.target.value)}
					placeholder="Search customers..."
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
				{searchOrders.length === 0 ? (
					<p>No orders found</p>
				) : (
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
							{searchOrders.map(item => (
								<tr key={item._id}>
									<td>#{item.orderNumber}</td>
									<td>{item.customer}</td>
									<td>{item.date}</td>
									<td>{item.amount.toLocaleString("ru-RU")} ₽</td>
									<td><span className={`${styles.status} ${getStatusClass(item.status)}`}>{item.status}</span></td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	)
}

export default Orders