import styles from "./RecentOrders.module.css"
import type { Order } from "../../types/order"
import type { Currency } from "../../types/auth"
import { formatCurrency } from "../../utils/formatCurrency"

type RecentOrdersProps = {
	orders: Order[]
	currency: Currency
}

const RecentOrders = ({ orders, currency }: RecentOrdersProps) => {
	const recentOrders = [...orders]
		.sort((a, b) => b.date.localeCompare(a.date))
		.slice(0, 5)

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
					{recentOrders.map(order => (
						<tr key={order._id}>
							<td>#{order.orderNumber}</td>
							<td>{order.customer}</td>
							<td>{formatCurrency(order.amount, currency)}</td>
							<td>
								<span
									className={`${styles.status} ${order.status === "Paid"
											? styles.paid
											: order.status === "Pending"
												? styles.pending
												: styles.cancelled
										}`}
								>
									{order.status}
								</span>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default RecentOrders