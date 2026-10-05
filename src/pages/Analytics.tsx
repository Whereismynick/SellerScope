import SalesTrendChart from "../components/SalesTrendChart/SalesTrendChart"
import StatCard from "../components/StatCard/StatCard"
import OrdersStatusChart from "../components/OrdersStatusChart/OrdersStatusChart"
import styles from "./Analytics.module.css"
import { useQuery } from "@tanstack/react-query"
import type { Order } from "../types/order"
import { apiClient } from "../api/apiClient"
import { useAuth } from "../hooks/useAuth"
import { formatCurrency } from "../utils/formatCurrency"

const fetchOrders = async (): Promise<Order[]> => {
  const response = await apiClient.get<Order[]>("/orders")
  return response.data
}

const Analytics = () => {
  const { user } = useAuth()
  const currency = user?.currency ?? "RUB"
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
          value={formatCurrency(
            Math.round(averageOrderValue),
            currency
          )}
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