import { Link, useParams } from "react-router-dom"
import { products, type ProductStatus } from "../data/products"
import styles from "./ProductDetails.module.css"

const ProductDetails = () => {
	const { id } = useParams()
	const getStatusClass = (status: ProductStatus) => {
		if(status === "Active") return styles.active
		if(status === "Low Stock") return styles.lowStock
		return styles.outOfStock
	}
	const findProduct = products.find(product => product.id === Number(id))
	if (!findProduct) return <h2>Product not found</h2>
	return (
		<div className={styles.page}>
			<Link className={styles.backLink} to={`/products`}>← Back to Products</Link>
			<h1 className={styles.title}>{findProduct.name}</h1>
			<div className={styles.card}>
				<div className={styles.row}>
					<span className={styles.label}>Price</span>
					<span className={styles.value}>{findProduct.price}</span>
				</div>

				<div className={styles.row}>
					<span className={styles.label}>Stock</span>
					<span className={styles.value}>{findProduct.stock}</span>
				</div>

				<div className={styles.row}>
					<span className={styles.label}>Status</span>
					<span className={`${styles.status} ${getStatusClass(findProduct.status)}`}>{findProduct.status}</span>
				</div>
			</div>
		</div>

	)
}

export default ProductDetails