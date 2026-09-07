import SalesTrendChart from "../components/SalesTrendChart/SalesTrendChart"
import StatCard from "../components/StatCard/StatCard"
import OrdersStatusChart from "../components/OrdersStatusChart/OrdersStatusChart"
import styles from "./Analytics.module.css"
import { useQuery } from "@tanstack/react-query"
import type { Order } from "../types/order"

const fetchOrders = async (): Promise<Order[]> => {
  const response = await fetch('http://localhost:3001/api/orders')
  if (!response.ok) {
    throw new Error("Failed to load orders")
  }
  return response.json()
}

const Analytics = () => {
  const {
    data: orders = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders
  })

  if (isLoading) return <p>Loading analytics...</p>
  if (error) return <p>Failed to load analytics</p>

  const paidOrders = orders.filter(order => order.status === "Paid")
  const cancelledOrders = orders.filter(order => order.status === "Cancelled")
  const averageOrderValue = paidOrders.length === 0 ? 0 : paidOrders.reduce((acc, order) => acc + order.amount, 0) / paidOrders.length
  return (
    <div className={styles.page}>
      <div className={styles.statsGrid}>
        <StatCard
          title="Average Order Value"
          value={`${Math.round(averageOrderValue).toLocaleString("ru-RU")} ₽`}
        />

        <StatCard
          title="Paid Orders"
          value={String(paidOrders.length)}
        />

        <StatCard
          title="Cancelled Orders"
          value={String(cancelledOrders.length)}
        />
      </div>
      <div className={styles.chartsGrid}>
        <SalesTrendChart orders={orders} />
        <OrdersStatusChart orders={orders} />
      </div>
    </div>
  )
}

export default Analytics