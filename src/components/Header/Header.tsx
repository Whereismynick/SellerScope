import styles from "./Header.module.css"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

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
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const title = location.pathname.startsWith("/products/")
    ? "Product Details"
    : titles[location.pathname] ?? "SellerScope"

  const handleLogout = () => {
    logout()
    navigate("/login")
  }
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>

      <div className={styles.userBlock}>
        <span className={styles.user}>{user?.name}</span>

        <div className={styles.avatar}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <button className={styles.logoutButton}
          onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  )
}

export default Header