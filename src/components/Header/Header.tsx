import styles from "./Header.module.css"
const Header = () => {
	return (
		<header className={styles.header}>
			<h1 className={styles.title}>Dashboard</h1>
			<div className={styles.userBlock}>
				<span className={styles.user}>Dmitry</span>
				<div className={styles.avatar}>D</div>
			</div>
		</header>
	)
}

export default Header