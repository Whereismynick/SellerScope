import { useState, useEffect } from "react"
import styles from "./Orders.module.css"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Order, OrderStatus, OrderItem } from "../types/order"
import { apiClient } from "../api/apiClient"
import type { Product } from "../types/product"
import OrderCreateForm from "../components/OrderCreateForm/OrderCreateForm"
import OrderDetailsDrawer from "../components/OrderDetailsDrawer/OrderDetailsDrawer"

type UpdateOrderStatus = {
	id: string
	status: OrderStatus
}

const updateOrderStatus = async ({
	id,
	status
}: UpdateOrderStatus): Promise<Order> => {
	const response = await apiClient.patch<Order>(
		`/orders/${id}`,
		{ status }
	)

	return response.data
}

const fetchOrders = async (): Promise<Order[]> => {
	const response = await apiClient.get<Order[]>("/orders")

	return response.data
}

type CreateOrderData = {
	customer: string
	amount: number
	status: OrderStatus
	items: {
		productId: string
		name: string
		quantity: number
		price: number
	}[]
}

const createOrder = async (
	data: CreateOrderData
): Promise<Order> => {
	const response = await apiClient.post<Order>(
		"/orders",
		data
	)

	return response.data
}

const fetchProducts = async (): Promise<Product[]> => {
	const response = await apiClient.get<Product[]>("/products")
	return response.data
}

const Orders = () => {
	const [search, setSearch] = useState("")
	const [selected, setSelected] = useState("All")
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
	const [customer, setCustomer] = useState("")
	const [selectedProductId, setSelectedProductId] = useState("")
	const [quantity, setQuantity] = useState(1)
	const [orderItems, setOrderItems] = useState<OrderItem[]>([])

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

	const {
		data: products = []
	} = useQuery({
		queryKey: ["products"],
		queryFn: fetchProducts
	})

	const queryClient = useQueryClient()

	const updateStatusMutation = useMutation({
		mutationFn: updateOrderStatus,
		onSuccess: updatedOrder => {
			queryClient.invalidateQueries({ queryKey: ["orders"] })
			setSelectedOrder(updatedOrder)
		}
	})

	const createOrderMutation = useMutation({
		mutationFn: createOrder,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["orders"] })

			setCustomer("")
			setSelectedProductId("")
			setQuantity(1)
			setOrderItems([])
		}
	})

	const searchOrders = items.filter(
		item =>
			item.customer.toLowerCase().includes(search.toLowerCase()) &&
			(selected === "All" || item.status === selected)
	)

	const selectedProduct = products.find(product => product._id === selectedProductId)

	const amount = orderItems.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	)

	const formatDate = (date: string) => {
		return new Date(date).toLocaleString("ru-RU", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		})
	}

	const handleCreateOrder = () => {
		if (!customer.trim()) return
		if (orderItems.length === 0) return

		const newOrder = {
			customer: customer.trim(),
			amount,
			status: "Pending" as OrderStatus,
			items: orderItems
		}

		createOrderMutation.mutate(newOrder)
	}

	const handleAddItem = () => {
		if (!selectedProduct) return

		const existingItem = orderItems.find(
			item => item.productId === selectedProduct._id
		)

		if (existingItem) {
			setOrderItems(prevItems =>
				prevItems.map(item =>
					item.productId === selectedProduct._id
						? {
							...item,
							quantity: item.quantity + quantity
						}
						: item
				)
			)

			return
		}

		const newItem: OrderItem = {
			productId: selectedProduct._id,
			name: selectedProduct.name,
			quantity,
			price: selectedProduct.price
		}

		setOrderItems(prevItems => [
			...prevItems,
			newItem
		])
	}

	const handleRemoveItem = (productId: string) => {
		setOrderItems(prevItems =>
			prevItems.filter(item => item.productId !== productId)
		)
	}

	return (
		<div className={styles.page}>
			<OrderCreateForm
				customer={customer}
				selectedProductId={selectedProductId}
				quantity={quantity}
				orderItems={orderItems}
				products={products}
				amount={amount}
				isCreating={createOrderMutation.isPending}
				hasError={!!createOrderMutation.error}
				onCustomerChange={setCustomer}
				onProductChange={setSelectedProductId}
				onQuantityChange={setQuantity}
				onAddItem={handleAddItem}
				onRemoveItem={handleRemoveItem}
				onCreateOrder={handleCreateOrder}
			/>
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
				{isLoading ? (
					<p>Loading orders...</p>
				) : error ? (
					<div>
						<p>{error.message}</p>
						<button onClick={() => refetch()}>
							Retry
						</button>
					</div>
				) : searchOrders.length === 0 ? (
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

										<td>{formatDate(item.date)}</td>

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
							<OrderDetailsDrawer
								order={selectedOrder}
								isUpdating={updateStatusMutation.isPending}
								hasError={!!updateStatusMutation.error}
								onClose={() => setSelectedOrder(null)}
								onStatusChange={status =>
									updateStatusMutation.mutate({
										id: selectedOrder._id,
										status
									})
								}
								formatDate={formatDate}
							/>
						)}
					</>
				)}
			</div>
		</div>
	)
}

export default Orders