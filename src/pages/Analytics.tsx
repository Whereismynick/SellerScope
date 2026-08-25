import SalesTrendChart from "../components/SalesTrendChart/SalesTrendChart"
import StatCard from "../components/StatCard/StatCard"
import OrdersStatusChart from "../components/OrdersStatusChart/OrdersStatusChart"
import styles from "./Analytics.module.css"

const Analytics = () => {
  return (
    <div className={styles.page}>
      <h2>Analytics</h2>

      <div className={styles.statsGrid}>
        <StatCard
          title="Conversion Rate"
          value="3.8%"
          change={0.6}
        />

        <StatCard
          title="Average Order Value"
          value="12 450 ₽"
          change={4.2}
        />

        <StatCard
          title="Repeat Customers"
          value="27%"
          change={2.1}
        />
      </div>
      <div className={styles.chartsGrid}>
        <SalesTrendChart />
        <OrdersStatusChart />
      </div>
    </div>
  )
}

export default Analytics