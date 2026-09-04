import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from "recharts"

import style from "./RevenueChart.module.css"
import type { Order } from "../../types/order"

type RevenueChartProps = {
	orders: Order[]
}

const RevenueChart = ({ orders }: RevenueChartProps) => {
	const revenueByDate = orders
		.filter(order => order.status === "Paid")
		.reduce<Record<string, number>>((acc, order) => {
			acc[order.date] = (acc[order.date] ?? 0) + order.amount
			return acc
		}, {})

	const chartData = Object.entries(revenueByDate)
		.map(([date, revenue]) => ({
			date,
			revenue
		}))
		.sort((a, b) => a.date.localeCompare(b.date))

	return (
		<div className={style.chartCard}>
			<h2 className={style.title}>Revenue Overview</h2>

			<ResponsiveContainer width="100%" height={300}>
				<LineChart
					data={chartData}
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
						dataKey="revenue"
						stroke="#6366f1"
						strokeWidth={3}
						dot={{ r: 4 }}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	)
}

export default RevenueChart