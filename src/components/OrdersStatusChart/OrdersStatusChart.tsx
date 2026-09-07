import {
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
} from "recharts"
import styles from "./OrdersStatusChart.module.css"
import type { Order } from "../../types/order"

type OrdersStatusChartProps = {
	orders: Order[]
}

const OrdersStatusChart = ({ orders }: OrdersStatusChartProps) => {
	const paid = orders.filter(order => order.status === "Paid").length
	const pending = orders.filter(order => order.status === "Pending").length
	const cancelled = orders.filter(order => order.status === "Cancelled").length
	const statusData = [
		{ name: "Paid", value: paid, fill: "#22c55e" },
		{ name: "Pending", value: pending, fill: "#f59e0b" },
		{ name: "Cancelled", value: cancelled, fill: "#ef4444" }
	]

	return (
		<div className={styles.chartCard}>
			<h2 className={styles.title}>Orders by Status</h2>

			<ResponsiveContainer width="100%" height={300}>
				<PieChart>
					<Pie
						data={statusData}
						dataKey="value"
						nameKey="name"
						cx="50%"
						cy="50%"
						outerRadius={90}
					/>

					<Tooltip />
					<Legend />
				</PieChart>
			</ResponsiveContainer>
		</div>
	)
}

export default OrdersStatusChart