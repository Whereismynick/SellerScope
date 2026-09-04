import styles from "./StatCard.module.css"

type StatCardProps = {
	title: string
	value: string
	change?: number
}

const StatCard = ({ title, value, change }: StatCardProps) => {
	const changeClass =
		change === undefined
			? ""
			: change > 0
				? styles.positive
				: change < 0
					? styles.negative
					: styles.neutral

	return (
		<div className={styles.statcard}>
			<p className={styles.title}>{title}</p>
			<h2 className={styles.value}>{value}</h2>

			{change !== undefined && (
				<span className={`${styles.change} ${changeClass}`}>
					{change > 0 ? "+" : ""}
					{change}%
				</span>
			)}
		</div>
	)
}

export default StatCard