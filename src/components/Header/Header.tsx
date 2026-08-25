import styles from "./Header.module.css"
import { useLocation } from "react-router-dom"

const titles: Record<string, string> = {
  "/": "Dashboard",
  "/products": "Products",
  "/orders": "Orders",
  "/analytics": "Analytics",
  "/inventory": "Inventory",
  "/settings": "Settings",
}

const Header = () => {
  const location = useLocation()
  const title = location.pathname.startsWith("/products/") 
    ? "Product Details"
    : titles[location.pathname] ?? "SellerScope"
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>

      <div className={styles.userBlock}>
        <span className={styles.user}>Dmitry</span>
        <div className={styles.avatar}>D</div>
      </div>
    </header>
  )
}

export default Header