import styles from "./TopProducts.module.css"
type Product = {
	product: string
	sales: number
	revenue: number
}

type TopProductsProps = {
	products: Product[]
}


const TopProducts = ({ products }: TopProductsProps) => {
	return (
		<div className={styles.card}>
			<h2 className={styles.title}>Top Products</h2>

			<table className={styles.table}>
				<thead>
					<tr>
						<th>Product</th>
						<th>Sales</th>
						<th>Revenue</th>
					</tr>
				</thead>

				<tbody>
					{products.map(prod => (
						<tr key={prod.product}>
							<td>{prod.product}</td>
							<td>{prod.sales}</td>
							<td>{prod.revenue}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default TopProducts