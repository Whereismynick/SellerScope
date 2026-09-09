import { useState } from "react"
import styles from "./Inventory.module.css"
import type { InventoryItem } from "../types/inventory"
import {
	useMutation,
	useQuery,
	useQueryClient
} from "@tanstack/react-query"

type UpdateInventoryItem = {
	id: string
	data: {
		stock: number
		reserved: number
	}
}

const updateInventoryItem = async ({
	id,
	data
}: UpdateInventoryItem): Promise<InventoryItem> => {
	const response = await fetch(
		`http://localhost:3001/api/inventory/${id}`,
		{
			method: "PATCH",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		}
	)

	if (!response.ok) {
		throw new Error("Failed to update inventory")
	}

	return response.json()
}

const fetchInventory = async (): Promise<InventoryItem[]> => {
	const response = await fetch("http://localhost:3001/api/inventory")

	if (!response.ok) {
		throw new Error("Failed to load inventory")
	}

	return response.json()
}

const Inventory = () => {
	const [search, setSearch] = useState("")
	const [onlyLowStock, setOnlyLowStock] = useState(false)

	const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
	const [stock, setStock] = useState(0)
	const [reserved, setReserved] = useState(0)
	const [editError, setEditError] = useState("")

	const queryClient = useQueryClient()

	const {
		data: items = [],
		isLoading,
		error,
		refetch
	} = useQuery({
		queryKey: ["inventory"],
		queryFn: fetchInventory
	})

	const updateInventoryMutation = useMutation({
		mutationFn: updateInventoryItem,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inventory"] })
			setEditingItem(null)
			setEditError("")
		}
	})

	const handleEdit = (item: InventoryItem) => {
		setEditingItem(item)
		setStock(item.stock)
		setReserved(item.reserved)
		setEditError("")
	}

	const handleCancel = () => {
		setEditingItem(null)
		setEditError("")
	}

	const handleSave = () => {
		if (!editingItem) return

		if (stock < 0 || reserved < 0) {
			setEditError("Stock and reserved cannot be negative")
			return
		}

		if (reserved > stock) {
			setEditError("Reserved cannot be greater than stock")
			return
		}

		setEditError("")

		updateInventoryMutation.mutate({
			id: editingItem._id,
			data: {
				stock,
				reserved
			}
		})
	}

	if (isLoading) {
		return <p>Loading inventory...</p>
	}

	if (error) {
		return (
			<div>
				<p>{error.message}</p>
				<button onClick={() => refetch()}>
					Retry
				</button>
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
		<div className={styles.page}>
			<div className={styles.toolbar}>
				<input
					className={styles.search}
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
								<th>Actions</th>
							</tr>
						</thead>

						<tbody>
							{filteredInventory.map(item => {
								const isEditing = editingItem?._id === item._id

								const currentAvailable = isEditing
									? stock - reserved
									: item.stock - item.reserved

								return (
									<tr key={item._id}>
										<td>{item.name}</td>

										<td>{item.sku}</td>

										<td>
											{isEditing ? (
												<input
													className={styles.numberInput}
													type="number"
													value={stock}
													min={0}
													onChange={e =>
														setStock(Number(e.target.value))
													}
												/>
											) : (
												item.stock
											)}
										</td>

										<td>
											{isEditing ? (
												<input
													className={styles.numberInput}
													type="number"
													value={reserved}
													min={0}
													onChange={e =>
														setReserved(Number(e.target.value))
													}
												/>
											) : (
												item.reserved
											)}
										</td>

										<td>{currentAvailable}</td>

										<td>
											<span
												className={`${styles.status} ${
													currentAvailable < 10
														? styles.lowStock
														: styles.inStock
												}`}
											>
												{currentAvailable < 10
													? "Low Stock"
													: "In Stock"}
											</span>
										</td>

										<td>
											{isEditing ? (
												<div className={styles.actions}>
													<button
														className={styles.saveButton}
														onClick={handleSave}
														disabled={updateInventoryMutation.isPending}
													>
														{updateInventoryMutation.isPending
															? "Saving..."
															: "Save"}
													</button>

													<button
														className={styles.cancelButton}
														onClick={handleCancel}
														disabled={updateInventoryMutation.isPending}
													>
														Cancel
													</button>

													{editError && (
														<p className={styles.editError}>
															{editError}
														</p>
													)}

													{updateInventoryMutation.error && (
														<p className={styles.editError}>
															Failed to update inventory
														</p>
													)}
												</div>
											) : (
												<button
													className={styles.editButton}
													onClick={() => handleEdit(item)}
												>
													Edit
												</button>
											)}
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