import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import styles from "./SalesTrendChart.module.css"

const salesData = [
	{ day: "Mon", sales: 42 },
	{ day: "Tue", sales: 58 },
	{ day: "Wed", sales: 51 },
	{ day: "Thu", sales: 73 },
	{ day: "Fri", sales: 69 },
	{ day: "Sat", sales: 88 },
	{ day: "Sun", sales: 81 },
]
const SalesTrendChart = () => {
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
						dataKey="day"
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