import { useState, useEffect } from "react"
import styles from "./Orders.module.css"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Order, OrderStatus } from "../types/order"

type UpdateOrderStatus = {
	id: string
	status: OrderStatus
}

const updateOrderStatus = async ({
	id,
	status
}: UpdateOrderStatus): Promise<Order> => {
	const response = await fetch(`http://localhost:3001/api/orders/${id}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ status })
	})

	if (!response.ok) {
		throw new Error("Failed to update order status")
	}

	return response.json()
}

const fetchOrders = async (): Promise<Order[]> => {
	const response = await fetch("http://localhost:3001/api/orders")

	if (!response.ok) {
		throw new Error("Failed to load orders")
	}

	return response.json()
}

const Orders = () => {
	const [search, setSearch] = useState("")
	const [selected, setSelected] = useState("All")
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

	useEffect(() => {
		if (!selectedOrder) return

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setSelectedOrder(null)
			}
		}

		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = "Hidden"

		window.addEventListener("keydown", handleKeyDown)

		return () => {
			window.removeEventListener("keydown", handleKeyDown)
			document.body.style.overflow = previousOverflow
		}
	}, [selectedOrder])

	const getStatusClass = (status: OrderStatus) => {
		if (status === "Paid") return styles.paid
		if (status === "Pending") return styles.pending
		return styles.cancelled
	}

	const {
		data: items = [],
		isLoading,
		error,
		refetch
	} = useQuery({
		queryKey: ["orders"],
		queryFn: fetchOrders
	})

	const queryClient = useQueryClient()

	const updateStatusMutation = useMutation({
		mutationFn: updateOrderStatus,
		onSuccess: updatedOrder => {
			queryClient.invalidateQueries({ queryKey: ["orders"] })
			setSelectedOrder(updatedOrder)
		}
	})

	if (isLoading) {
		return <p>Loading orders...</p>
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

	const searchOrders = items.filter(
		item =>
			item.customer.toLowerCase().includes(search.toLowerCase()) &&
			(selected === "All" || item.status === selected)
	)

	return (
		<div className={styles.page}>
			<div className={styles.toolbar}>
				<input
					className={styles.input}
					value={search}
					onChange={e => setSearch(e.target.value)}
					placeholder="Search customers..."
				/>

				<select
					className={styles.select}
					value={selected}
					onChange={e => setSelected(e.target.value)}
				>
					<option value="All">All</option>
					<option value="Paid">Paid</option>
					<option value="Pending">Pending</option>
					<option value="Cancelled">Cancelled</option>
				</select>
			</div>

			<div className={styles.tableCard}>
				{searchOrders.length === 0 ? (
					<p>No orders found</p>
				) : (
					<>
						<table className={styles.table}>
							<thead>
								<tr>
									<th>Order</th>
									<th>Customer</th>
									<th>Date</th>
									<th>Amount</th>
									<th>Status</th>
									<th>Actions</th>
								</tr>
							</thead>

							<tbody>
								{searchOrders.map(item => (
									<tr key={item._id}>
										<td>#{item.orderNumber}</td>

										<td>{item.customer}</td>

										<td>{item.date}</td>

										<td>
											{item.amount.toLocaleString("ru-RU")} ₽
										</td>

										<td>
											<span
												className={`${styles.status} ${getStatusClass(item.status)}`}
											>
												{item.status}
											</span>
										</td>

										<td>
											<button
												className={styles.viewButton}
												onClick={() => setSelectedOrder(item)}
												onMouseUp={e => e.currentTarget.blur()}
											>
												View
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>

						{selectedOrder && (
							<>
								<div
									className={styles.drawerOverlay}
									onClick={() => setSelectedOrder(null)}
								/>

								<aside className={styles.drawer}>
									<div className={styles.drawerHeader}>
										<div>
											<p className={styles.drawerEyebrow}>Order details</p>
											<h2>Order #{selectedOrder.orderNumber}</h2>
											<p className={styles.drawerCustomer}>
												{selectedOrder.customer}
											</p>
										</div>

										<button
											type="button"
											className={styles.closeButton}
											onClick={() => setSelectedOrder(null)}
										>
											×
										</button>
									</div>

									<div className={styles.drawerMeta}>
										<div className={styles.metaItem}>
											<span>Date</span>
											<strong>{selectedOrder.date}</strong>
										</div>

										<div className={styles.metaItem}>
											<span>Total</span>
											<strong>
												{selectedOrder.amount.toLocaleString("ru-RU")} ₽
											</strong>
										</div>

										<div className={styles.metaItem}>
											<span>Status</span>

											<select
												value={selectedOrder.status}
												onChange={e =>
													updateStatusMutation.mutate({
														id: selectedOrder._id,
														status: e.target.value as OrderStatus
													})
												}
												disabled={updateStatusMutation.isPending}
											>
												<option value="Paid">Paid</option>
												<option value="Pending">Pending</option>
												<option value="Cancelled">Cancelled</option>
											</select>
										</div>
									</div>

									{updateStatusMutation.isPending && (
										<p className={styles.savingText}>Saving...</p>
									)}

									{updateStatusMutation.error && (
										<p className={styles.updateError}>
											Failed to update order status
										</p>
									)}

									<div className={styles.itemsSection}>
										<h3>Items</h3>

										<div className={styles.itemsList}>
											{selectedOrder.items.map(item => (
												<div
													key={item.productId}
													className={styles.itemRow}
												>
													<div>
														<p className={styles.itemName}>
															{item.name}
														</p>

														<p className={styles.itemMeta}>
															{item.quantity} ×{" "}
															{item.price.toLocaleString("ru-RU")} ₽
														</p>
													</div>

													<strong>
														{(item.price * item.quantity).toLocaleString("ru-RU")} ₽
													</strong>
												</div>
											))}
										</div>
									</div>
								</aside>
							</>
						)}
					</>
				)}
			</div>
		</div>
	)
}

export default Orders