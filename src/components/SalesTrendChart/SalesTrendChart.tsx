import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import styles from "./SalesTrendChart.module.css"
import type { Order } from "../../types/order"

type SalesTrendChartProps = {
	orders: Order[]
}

const SalesTrendChart = ({ orders }: SalesTrendChartProps) => {

	const salesByDate = orders
		.filter(order => order.status === "Paid")
		.reduce<Record<string, number>>((acc, order) => {
			const orderSales = order.items.reduce((sum, item) => sum + item.quantity, 0)
			acc[order.date] = (acc[order.date] ?? 0) + orderSales
			return acc
		}, {})

	const salesData = Object.entries(salesByDate).map(([date, sales]) => ({
		date,
		sales
	}))
		.sort((a, b) => a.date.localeCompare(b.date))
	return (
		<div className={styles.chartCard}>
			<h2 className={styles.title}>Sales Trend</h2>
			<ResponsiveContainer width="100%" height={300}>
				<LineChart
					data={salesData}
					margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
				>
					<CartesianGrid
						strokeDasharray="3 3"
						vertical={false}
					/>
					<XAxis
						dataKey="date"
						tickLine={false}
						axisLine={false}
					/>
					<YAxis
						tickLine={false}
						axisLine={false}
					/>
					<Tooltip />
					<Line
						type="monotone"
						dataKey="sales"
						stroke="#6366f1"
						strokeWidth={3}
						dot={{ r: 4 }}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	)
}

export default SalesTrendChart