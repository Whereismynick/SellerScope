import styles from "./StatCard.module.css"
type StatCardProps = {
	title: string,
	value: string,
	change: number
}

const StatCard = ({ title, value, change }: StatCardProps) => {
	return (
		<div className={styles.statcard}>
			<p className={styles.title}>{title}</p>
			<h2 className={styles.value}>{value}</h2>
			<span className={`${styles.change} ${change > 0 ? styles.positive : styles.negative}`}>
				{change > 0 ? "+" : ""}
				{change}%</span>
		</div>
	)
}

export default StatCard