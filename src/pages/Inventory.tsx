import { useState } from "react"
import styles from "./Inventory.module.css"
type InventoryItem = {
	id: number
	name: string
	sku: string
	stock: number
	reserved: number
}

const inventory: InventoryItem[] = [
	{ id: 1, name: "iPhone 15 Pro", sku: "APL-IP15P", stock: 24, reserved: 5 },
	{ id: 2, name: "MacBook Air M3", sku: "APL-MBA-M3", stock: 8, reserved: 3 },
	{ id: 3, name: "AirPods Pro", sku: "APL-APP2", stock: 41, reserved: 12 },
	{ id: 4, name: "Apple Watch Series 9", sku: "APL-AW9", stock: 7, reserved: 2 },
	{ id: 5, name: "USB-C Hub", sku: "ACC-USBC-HUB", stock: 14, reserved: 6 },
	{ id: 6, name: "MacBook Stand", sku: "ACC-MB-STAND", stock: 5, reserved: 1 }
]

const Inventory = () => {
	const [search, setSearch] = useState('')
	const [onlyLowStock, setOnlyLowStock] = useState(false)

	const filteredInventory = inventory.filter(item => item.name.toLowerCase().includes(search.toLowerCase()) && (!onlyLowStock || (item.stock - item.reserved < 10)))
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
								<tr key={item.id}>
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
			</div>
		</div>
	)
}

export default Inventory