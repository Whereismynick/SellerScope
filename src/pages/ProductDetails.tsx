import { Link, useParams } from "react-router-dom"
import { type Product, type ProductStatus } from "../types/product"
import styles from "./ProductDetails.module.css"
import { useQuery } from "@tanstack/react-query"


const fetchProduct = async (id: string): Promise<Product> => {
		const response = await fetch(`http://localhost:3001/api/products/${id}`)
		if (!response.ok) throw new Error(`Failed to load product`)
		const data = await response.json()
		return data
	}

const ProductDetails = () => {
	const { id } = useParams()
	const {
		data: product,
		isLoading,
		error
	} = useQuery({
		queryKey: ["product", id],
		queryFn: () => fetchProduct(id!),
		enabled: Boolean(id)
	})
	if(isLoading){
		return <p>Loading product...</p>
	}

	if(error){
		return <p>{error.message}</p>
	}

	if(!product){
		return <p>Product not found</p>
	}

	const getStatusClass = (status: ProductStatus) => {
		if (status === "Active") return styles.active
		if (status === "Low Stock") return styles.lowStock
		return styles.outOfStock
	}
	

	return (
		<div className={styles.page}>
			<Link className={styles.backLink} to={`/products`}>← Back to Products</Link>
			<h1 className={styles.title}>{product.name}</h1>
			<div className={styles.card}>
				<div className={styles.row}>
					<span className={styles.label}>Price</span>
					<span className={styles.value}>{product.price.toLocaleString("ru-RU")} ₽</span>
				</div>

				<div className={styles.row}>
					<span className={styles.label}>Stock</span>
					<span className={styles.value}>{product.stock}</span>
				</div>

				<div className={styles.row}>
					<span className={styles.label}>Status</span>
					<span className={`${styles.status} ${getStatusClass(product.status)}`}>{product.status}</span>
				</div>
			</div>
		</div>

	)
}

export default ProductDetails