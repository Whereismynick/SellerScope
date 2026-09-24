import type { Order, OrderStatus } from "../../types/order"
import styles from "./OrderDetailsDrawer.module.css"

type OrderDetailsDrawerProps = {
	order: Order
	isUpdating: boolean
	hasError: boolean

	onClose: () => void
	onStatusChange: (status: OrderStatus) => void
	formatDate: (date: string) => string
}

const OrderDetailsDrawer = ({
	order,
	isUpdating,
	hasError,
	onClose,
	onStatusChange,
	formatDate
}: OrderDetailsDrawerProps) => {
	return (
		<>
			<div
				className={styles.drawerOverlay}
				onClick={onClose}
			/>

			<aside className={styles.drawer}>
				<div className={styles.drawerHeader}>
					<div>
						<p className={styles.drawerEyebrow}>
							Order details
						</p>

						<h2>
							Order #{order.orderNumber}
						</h2>

						<p className={styles.drawerCustomer}>
							{order.customer}
						</p>
					</div>

					<button
						type="button"
						className={styles.closeButton}
						onClick={onClose}
					>
						×
					</button>
				</div>
				<div className={styles.drawerMeta}>
					<div className={styles.metaItem}>
						<span>Date</span>
						<strong>{formatDate(order.date)}</strong>
					</div>

					<div className={styles.metaItem}>
						<span>Total</span>
						<strong>
							{order.amount.toLocaleString("ru-RU")} ₽
						</strong>
					</div>

					<div className={styles.metaItem}>
						<span>Status</span>

						<select
							value={order.status}
							onChange={e =>
								onStatusChange(e.target.value as OrderStatus)
							}
							disabled={isUpdating}
						>
							<option value="Paid">Paid</option>
							<option value="Pending">Pending</option>
							<option value="Cancelled">Cancelled</option>
						</select>
					</div>
				</div>
				{isUpdating && (
					<p className={styles.savingText}>
						Saving...
					</p>
				)}

				{hasError && (
					<p className={styles.updateError}>
						Failed to update order status
					</p>
				)}
				<div className={styles.itemsSection}>
					<h3>Items</h3>

					<div className={styles.itemsList}>
						{order.items.map(item => (
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
									{(
										item.price * item.quantity
									).toLocaleString("ru-RU")} ₽
								</strong>
							</div>
						))}
					</div>
				</div>
			</aside>
		</>
	)
}

export default OrderDetailsDrawer