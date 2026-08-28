import { useState } from "react"
import styles from './Products.module.css'
import { type Product, type ProductStatus } from "../types/product"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

const fetchProducts = async (): Promise<Product[]> => {
		const response = await fetch(`http://localhost:3001/api/products`)
		if (!response.ok) throw new Error(`Failed to load products`)
		const data = await response.json()
		return data
	}

const Products = () => {
	const [search, setSearch] = useState("")
	const [selected, setSelected] = useState("All")

	const getStatusClass = (status: ProductStatus) => {
		if (status === 'Active') return styles.active
		if (status === 'Low Stock') return styles.lowStock
		return styles.outOfStock
	}

	const {
		data: items = [],
		isLoading,
		error,
		refetch
	} = useQuery({
		queryKey: ["products"],
		queryFn: fetchProducts
	})

	const filteredProducts = items.filter(item => item.name.toLowerCase().includes(search.toLowerCase()) && (selected === "All" || item.status === selected))

	

	return (
		<div className={styles.page}>
			<div className={styles.toolbar}>
				<input className={styles.input}
					value={search}
					onChange={e => setSearch(e.target.value)}
					placeholder="Search products..."
				/>
				<select className={styles.select}
					value={selected}
					onChange={e => setSelected(e.target.value)}>
					<option value="All">All</option>
					<option value="Active">Active</option>
					<option value="Low Stock">Low Stock</option>
					<option value="Out of Stock">Out of Stock</option>

				</select>
			</div>
			<div className={styles.tableCard}>
				{isLoading ? (<p>Loading products...</p>) : error ? (
					<div>
						<p>{error.message}</p>
						<button onClick={() => refetch()}>Retry</button>
					</div>
				) : filteredProducts.length === 0 ? (
					<p>No products found</p>
				) : (
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
									<td>{product.price.toLocaleString("ru-RU")} ₽</td>
									<td>{product.stock}</td>
									<td><span className={`${styles.status} ${getStatusClass(product.status)}`}>{product.status}</span></td>
								</tr>
							))}

						</tbody>
					</table>
				)}
			</div>
		</div>
	)
}

export default Products