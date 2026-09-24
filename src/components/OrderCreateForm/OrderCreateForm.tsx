import type { OrderItem } from "../../types/order"
import type { Product } from "../../types/product"
import styles from "./OrderCreateForm.module.css"

type OrderCreateFormProps = {
	customer: string
	selectedProductId: string
	quantity: number
	orderItems: OrderItem[]
	products: Product[]
	amount: number
	isCreating: boolean
	hasError: boolean

	onCustomerChange: (value: string) => void
	onProductChange: (value: string) => void
	onQuantityChange: (value: number) => void
	onAddItem: () => void
	onRemoveItem: (productId: string) => void
	onCreateOrder: () => void
}

const OrderCreateForm = ({
	customer,
	selectedProductId,
	quantity,
	orderItems,
	products,
	amount,
	isCreating,
	hasError,
	onCustomerChange,
	onProductChange,
	onQuantityChange,
	onAddItem,
	onRemoveItem,
	onCreateOrder
}: OrderCreateFormProps) => {
	return (


		<div className={styles.addOrderCard}>
			<h3>Create order</h3>

			<div className={styles.orderForm}>
				<input
					value={customer}
					onChange={e => onCustomerChange(e.target.value)}
					placeholder="Customer name"
				/>

				<select
					value={selectedProductId}
					onChange={e => onProductChange(e.target.value)}
				>
					<option value="">Select product</option>

					{products.map(product => (
						<option
							key={product._id}
							value={product._id}
						>
							{product.name}
						</option>
					))}
				</select>
				<button
					type="button"
					onClick={onAddItem}
					disabled={!selectedProductId}
				>
					Add item
				</button>
				<input
					type="number"
					min={1}
					value={quantity === 0 ? "" : quantity}
					onChange={e => {
						const value = e.target.value

						if (value === "") {
							onQuantityChange(0)
							return
						}

						onQuantityChange(Number(value))
					}}
				/>

				<div className={styles.orderAmount}>
					{amount.toLocaleString("ru-RU")} ₽
				</div>

				<button
					onClick={onCreateOrder}
					disabled={
						isCreating ||
						!customer.trim() ||
						orderItems.length === 0
					}
				>
					{isCreating ? "Creating..." : "Create order"}
				</button>
			</div>
			{orderItems.length > 0 && (
				<div className={styles.orderItems}>
					{orderItems.map(item => (
						<div
							key={item.productId}
							className={styles.orderItem}
						>
							<div>
								<div className={styles.orderItemName}>
									{item.name}
								</div>

								<div className={styles.orderItemMeta}>
									{item.quantity} ×{" "}
									{item.price.toLocaleString("ru-RU")} ₽
								</div>
							</div>

							<button
								type="button"
								className={styles.removeItemButton}
								onClick={() => onRemoveItem(item.productId)}
							>
								Remove
							</button>
						</div>
					))}
				</div>
			)}
			{hasError && (
				<p className={styles.createError}>
					Failed to create order
				</p>
			)}
		</div>
	)
}
export default OrderCreateForm
