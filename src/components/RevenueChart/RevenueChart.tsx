import {
  CartesianGrid,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line
} from "recharts"

import style from "./RevenueChart.module.css"

const revenueData = [
  { day: "Mon", revenue: 120000 },
  { day: "Tue", revenue: 180000 },
  { day: "Wed", revenue: 150000 },
  { day: "Thu", revenue: 230000 },
  { day: "Fri", revenue: 210000 },
  { day: "Sat", revenue: 260000 },
  { day: "Sun", revenue: 240000 }
]

const RevenueChart = () => {
  return (
    <div className={style.chartCard}>
      <h2 className={style.title}>Revenue Overview</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={revenueData}
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