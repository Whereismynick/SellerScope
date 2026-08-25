import RecentOrders from "../components/RecentOrders/RecentOrders"
import RevenueChart from "../components/RevenueChart/RevenueChart"
import StatCard from "../components/StatCard/StatCard"
import TopProducts from "../components/TopProducts/TopProducts"
import styles from "./Dashboard.module.css"

const topProducts = [
	{ product: "iPhone Case", sales: 245, revenue: 184000 },
	{ product: "AirPods", sales: 189, revenue: 152000 },
	{ product: "MacBook Stand", sales: 156, revenue: 121000 },
	{ product: "USB-C Hub", sales: 98, revenue: 74000 }
]

const Dashboard = () => {
	return (
		<div>
			<div className={styles.statsGrid}>
				<StatCard title="Revenue" value="1 284 000 ₽" change={12.4} />
				<StatCard title="Orders" value="347" change={8.1} />
				<StatCard title="Profit" value="328 400 ₽" change={6.7} />
				<StatCard title="Returns" value="18" change={-2.3} />
			</div>
			<RevenueChart />
			<div className={styles.bottomGrid}>
				<TopProducts products={topProducts} />
				<RecentOrders />
			</div>
		</div>
	)
}

export default Dashboard