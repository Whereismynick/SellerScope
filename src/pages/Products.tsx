import { useState } from "react"
import styles from './Products.module.css'
import { products, type ProductStatus } from "../data/products"
import { Link } from "react-router-dom"
const Products = () => {

	const [search, setSearch] = useState("")
	const [selected, setSelected] = useState("All")
	const filteredProducts = products.filter(product => product.name.toLowerCase().includes(search.toLowerCase()) && (selected === "All" || product.status === selected))
	const getStatusClass = (status: ProductStatus) => {
		if (status === 'Active') return styles.active
		if (status === 'Low Stock') return styles.lowStock
		return styles.outOfStock
	}
	return (
		<div>
			<h2>Products</h2>
			<input className={styles.search}
				value={search}
				onChange={e => setSearch(e.target.value)}
			/>
			<select className={styles.select}
				value={selected}
				onChange={e => setSelected(e.target.value)}>
				<option value="All">All</option>
				<option value="Active">Active</option>
				<option value="Low Stock">Low Stock</option>
				<option value="Out of Stock">Out of Stock</option>

			</select>
			<div className={styles.tableCard}>
				<table className={styles.table}>
					<thead>
						<tr>
							<th>Name</th>
							<th>Price</th>
							<th>Stock</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{filteredProducts.map(product => (
							<tr key={product.id}>
								<td><Link to={`/products/${product.id}`}>{product.name}</Link></td>
								<td>{product.price}</td>
								<td>{product.stock}</td>
								<td><span className={`${styles.status} ${getStatusClass(product.status)}`}>{product.status}</span></td>
							</tr>
						))}

					</tbody>
				</table>
			</div>
		</div>
	)
}

export default Products