import {
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
} from "recharts"
import styles from "./OrdersStatusChart.module.css"

const statusData = [
	{ name: "Paid", value: 68, fill: "#22c55e" },
	{ name: "Pending", value: 21, fill: "#f59e0b" },
	{ name: "Cancelled", value: 11, fill: "#ef4444" },
]

const OrdersStatusChart = () => {
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