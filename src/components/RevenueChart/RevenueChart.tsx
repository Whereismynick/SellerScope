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
import type { Currency } from "../../types/auth"
import { formatCurrency } from "../../utils/formatCurrency"

type RevenueChartProps = {
	orders: Order[]
	currency: Currency
}

const RevenueChart = ({
	orders,
	currency
}: RevenueChartProps) => {
	const getDateKey = (date: string) => {
		const value = new Date(date)

		const year = value.getFullYear()
		const month = String(
			value.getMonth() + 1
		).padStart(2, "0")
		const day = String(
			value.getDate()
		).padStart(2, "0")

		return `${year}-${month}-${day}`
	}

	const formatChartDate = (date: string) => {
		const [, month, day] = date.split("-")

		return `${day}.${month}`
	}

	const formatFullDate = (date: string) => {
		const [year, month, day] = date.split("-")

		return `${day}.${month}.${year}`
	}

	const revenueByDate = orders
		.filter(order => order.status === "Paid")
		.reduce<Record<string, number>>((acc, order) => {
			const date = getDateKey(order.date)

			acc[date] =
				(acc[date] ?? 0) + order.amount

			return acc
		}, {})

	const chartData = Object.entries(revenueByDate)
		.map(([date, revenue]) => ({
			date,
			revenue
		}))
		.sort((a, b) =>
			a.date.localeCompare(b.date)
		)

	return (
		<div className={style.chartCard}>
			<h2 className={style.title}>
				Revenue Overview
			</h2>

			<ResponsiveContainer
				width="100%"
				height={300}
			>
				<LineChart
					data={chartData}
					margin={{
						top: 10,
						right: 20,
						left: 10,
						bottom: 0
					}}
				>
					<CartesianGrid
						strokeDasharray="3 3"
						vertical={false}
					/>

					<XAxis
						dataKey="date"
						tickFormatter={formatChartDate}
						tickLine={false}
						axisLine={false}
					/>

					<YAxis
						tickLine={false}
						axisLine={false}
					/>

					<Tooltip
						labelFormatter={label =>
							formatFullDate(
								String(label)
							)
						}
						formatter={value => [
							formatCurrency(
								Number(value),
								currency
							),
							"Revenue"
						]}
					/>

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