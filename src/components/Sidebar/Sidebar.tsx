import { NavLink } from "react-router-dom"
import styles from "./Sidebar.module.css"

const Sidebar = () => {
	return (
		<aside className={styles.sidebar}>
		<div className={styles.logo}>SellerScope</div>

		<nav className={styles.nav}>
			<NavLink
				to="/"
				className={({ isActive }) =>
					isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
				}
			>
				Dashboard
			</NavLink>

			<NavLink
				to="/products"
				className={({ isActive }) =>
					isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
				}
			>
				Products
			</NavLink>

			<NavLink
				to="/orders"
				className={({ isActive }) =>
					isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
				}
			>
				Orders
			</NavLink>

			<NavLink
				to="/analytics"
				className={({ isActive }) =>
					isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
				}
			>
				Analytics
			</NavLink>

			<NavLink
				to="/inventory"
				className={({ isActive }) =>
					isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
				}
			>
				Inventory
			</NavLink>

			<NavLink
				to="/settings"
				className={({ isActive }) =>
					isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
				}
			>
				Settings
			</NavLink>
		</nav>
		</aside>
	)
}

export default Sidebar