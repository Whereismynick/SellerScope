import RecentOrders from "../components/RecentOrders/RecentOrders"
import RevenueChart from "../components/RevenueChart/RevenueChart"
import StatCard from "../components/StatCard/StatCard"
import TopProducts from "../components/TopProducts/TopProducts"
import type { Order } from "../types/order"
import type { Product } from "../types/product"
import styles from "./Dashboard.module.css"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "../api/apiClient"

type GroupedProduct = {
	product: string
	sales: number
	revenue: number
}

const fetchProducts = async (): Promise<Product[]> => {
	const response = await apiClient.get<Product[]>("/products")
	return response.data
}

const fetchOrders = async (): Promise<Order[]> => {
	const response = await apiClient.get<Order[]>("/orders")
	return response.data
}

const Dashboard = () => {
	const {
		data: products = [],
		isLoading: productsLoading,
		error: productsError
	} = useQuery({
		queryKey: ["products"],
		queryFn: fetchProducts
	})

	const {
		data: orders = [],
		isLoading: ordersLoading,
		error: ordersError
	} = useQuery({
		queryKey: ["orders"],
		queryFn: fetchOrders
	})

	if (ordersLoading || productsLoading) {
		return <p>Loading dashboard</p>
	}

	if (ordersError || productsError) {
		return <p>Failed to load dashboard</p>
	}

	const revenue = orders
		.filter(order => order.status === "Paid")
		.reduce((sum, order) => sum + order.amount, 0)
	const lowStockProducts = products
		.filter(product => product.status === "Low Stock" ||
			product.status === "Out of Stock").length
	const paidItems = orders
		.filter(order => order.status === "Paid")
		.flatMap(order => order.items)

	const groupProducts = paidItems.reduce<Record<string, GroupedProduct>>(
		(acc, item) => {
			if (!acc[item.productId]) {
				acc[item.productId] = {
					product: item.name,
					sales: 0,
					revenue: 0
				}
			}

			acc[item.productId].sales += item.quantity
			acc[item.productId].revenue += item.quantity * item.price

			return acc
		},
		{}
	)
	const topProducts = Object.values(groupProducts)
		.sort((a, b) => b.revenue - a.revenue)
		.slice(0, 4)

	return (
		<div>
			<div className={styles.statsGrid}>
				<StatCard
					title="Revenue"
					value={`${revenue.toLocaleString("ru-RU")} ₽`}
				/>

				<StatCard
					title="Orders"
					value={String(orders.length)}
				/>

				<StatCard
					title="Products"
					value={String(products.length)}
				/>

				<StatCard
					title="Low stock"
					value={String(lowStockProducts)}
				/>
			</div>

			<RevenueChart orders={orders} />

			<div className={styles.bottomGrid}>
				<TopProducts products={topProducts} />
				<RecentOrders orders={orders} />
			</div>
		</div>
	)
}

export default Dashboard