import { useState } from "react"
import styles from "./Inventory.module.css"
import type { InventoryItem } from "../types/inventory"
import { useQuery } from "@tanstack/react-query"


const fetchInventory = async (): Promise<InventoryItem[]> => {
	const response = await fetch(`http://localhost:3001/api/inventory`)
	if (!response.ok) throw new Error(`Failed to load inventory`)
	const data = await response.json()
	return data
}

const Inventory = () => {
	const [search, setSearch] = useState('')
	const [onlyLowStock, setOnlyLowStock] = useState(false)
	const {
		data: items = [],
		isLoading,
		error,
		refetch
	} = useQuery({
		queryKey: ["inventory"],
		queryFn: fetchInventory
	})

	if (isLoading) {
		return <p>Loading inventory...</p>
	}

	if (error) {
		return (
			<div>
				<p>{error.message}</p>
				<button onClick={() => refetch()}>Retry</button>
			</div>
		)
	}

	const filteredInventory = items.filter(item =>
		(
			item.name.toLowerCase().includes(search.toLowerCase()) ||
			item.sku.toLowerCase().includes(search.toLowerCase())
		) &&
		(!onlyLowStock || item.stock - item.reserved < 10)
	)
	return (
		<div>
			<div className={styles.toolbar}>
				<input className={styles.search}
					value={search}
					onChange={e => setSearch(e.target.value)}
					placeholder="Search products or SKU..."
				/>
				<label className={styles.checkboxLabel}>
					<input
						type="checkbox"
						checked={onlyLowStock}
						onChange={e => setOnlyLowStock(e.target.checked)}
					/>
					Low stock only
				</label>
			</div>
			<div className={styles.tableCard}>
				{filteredInventory.length === 0 ? (
					<p>No inventory found</p>
				) : (
					<table className={styles.table}>
						<thead>
							<tr>
								<th>Product</th>
								<th>SKU</th>
								<th>Stock</th>
								<th>Reserved</th>
								<th>Available</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							{filteredInventory.map(item => {
								const available = item.stock - item.reserved

								return (
									<tr key={item._id}>
										<td>{item.name}</td>
										<td>{item.sku}</td>
										<td>{item.stock}</td>
										<td>{item.reserved}</td>
										<td>{available}</td>
										<td>
											<span
												className={`${styles.status} ${available < 10 ? styles.lowStock : styles.inStock
													}`}
											>
												{available < 10 ? "Low Stock" : "In Stock"}
											</span>
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				)}
			</div>
		</div>
	)
}

export default Inventory