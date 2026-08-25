import styles from "./RecentOrders.module.css"
type OrderStatus = "Paid" | "Pending" | "Cancelled"
type Order = {
	id: number
	customer: string
	amount: number
	status: OrderStatus
}

const orders: Order[] = [
	{
		id: 1000,
		customer: "Anna",
		amount: 12000,
		status: "Paid"
	},
	{
		id: 1001,
		customer: "Dmitry",
		amount: 8600,
		status: "Pending"
	},
	{
		id: 1002,
		customer: "Max",
		amount: 15400,
		status: "Paid"
	},
	{
		id: 1003,
		customer: "Olga",
		amount: 4200,
		status: "Cancelled"
	}
]

const RecentOrders = () => {
	return (
		<div className={styles.card}>
			<h2 className={styles.title}>Recent Orders</h2>
			<table className={styles.table}>
				<thead>
					<tr>
						<th>Order</th>
						<th>Customer</th>
						<th>Amount</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					{orders.map(order => (
						<tr key={order.id}>
							<td>#{order.id}</td>
							<td>{order.customer}</td>
							<td>{order.amount.toLocaleString("ru-RU")} ₽</td>
							<td>
								<span className={`${styles.status} ${order.status === "Paid" ? styles.paid
										: order.status === "Pending" ? styles.pending
											: styles.cancelled}`
								}>{order.status}</span>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default RecentOrders