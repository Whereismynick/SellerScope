import { useState } from "react"
import styles from "./Products.module.css"
import { type NewProduct, type Product, type ProductStatus } from "../types/product"
import { Link } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const productSchema = z.object({
	name: z.string().trim().min(1, "Product name is required"),
	price: z.number().min(1, "Price must be greater than 0"),
	stock: z.number().min(0, "Stock cannot be negative"),
	status: z.enum(["Active", "Low Stock", "Out of Stock"])
})

type ProductForm = z.infer<typeof productSchema>

const fetchProducts = async (): Promise<Product[]> => {
	const response = await fetch("http://localhost:3001/api/products")

	if (!response.ok) {
		throw new Error("Failed to load products")
	}

	const data = await response.json()
	return data
}

const createProduct = async (newProduct: NewProduct): Promise<Product> => {
	const response = await fetch("http://localhost:3001/api/products", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(newProduct)
	})

	if (!response.ok) {
		throw new Error("Failed to create product")
	}

	return response.json()
}

const Products = () => {
	const [search, setSearch] = useState("")
	const [selected, setSelected] = useState("All")

	const getStatusClass = (status: ProductStatus) => {
		if (status === "Active") return styles.active
		if (status === "Low Stock") return styles.lowStock
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

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors }
	} = useForm<ProductForm>({
		resolver: zodResolver(productSchema),
		defaultValues: {
			name: "",
			price: 0,
			stock: 0,
			status: "Active"
		}
	})

	const queryClient = useQueryClient()

	const createProductMutation = useMutation({
		mutationFn: createProduct,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["products"] })
			reset()
		}
	})

	const onSubmit = (data: ProductForm) => {
		createProductMutation.mutate(data)
	}

	const filteredProducts = items.filter(
		item =>
			item.name.toLowerCase().includes(search.toLowerCase()) &&
			(selected === "All" || item.status === selected)
	)

	return (
		<div className={styles.page}>
			<div className={styles.addProductCard}>
				<h3>Add product</h3>

				<form onSubmit={handleSubmit(onSubmit)}>
					<div className={styles.formField}>
						<input
							placeholder="Product name"
							{...register("name")}
						/>
						{errors.name && <p>{errors.name.message}</p>}
					</div>

					<div className={styles.formField}>
						<input
							type="number"
							placeholder="Price"
							{...register("price", { valueAsNumber: true })}
						/>
						{errors.price && <p>{errors.price.message}</p>}
					</div>

					<div className={styles.formField}>
						<input
							type="number"
							placeholder="Stock"
							{...register("stock", { valueAsNumber: true })}
						/>
						{errors.stock && <p>{errors.stock.message}</p>}
					</div>

					<div className={styles.formField}>
						<select {...register("status")}>
							<option value="Active">Active</option>
							<option value="Low Stock">Low Stock</option>
							<option value="Out of Stock">Out of Stock</option>
						</select>
						{errors.status && <p>{errors.status.message}</p>}
					</div>

					<button
						type="submit"
						disabled={createProductMutation.isPending}
					>
						{createProductMutation.isPending ? "Adding..." : "Add product"}
					</button>
				</form>

				{createProductMutation.error && (
					<p className={styles.createError}>
						{createProductMutation.error.message}
					</p>
				)}
			</div>

			<div className={styles.toolbar}>
				<input
					className={styles.input}
					value={search}
					onChange={e => setSearch(e.target.value)}
					placeholder="Search products..."
				/>

				<select
					className={styles.select}
					value={selected}
					onChange={e => setSelected(e.target.value)}
				>
					<option value="All">All</option>
					<option value="Active">Active</option>
					<option value="Low Stock">Low Stock</option>
					<option value="Out of Stock">Out of Stock</option>
				</select>
			</div>

			<div className={styles.tableCard}>
				{isLoading ? (
					<p>Loading products...</p>
				) : error ? (
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
								<tr key={product._id}>
									<td>
										<Link to={`/products/${product._id}`}>
											{product.name}
										</Link>
									</td>
									<td>{product.price.toLocaleString("ru-RU")} ₽</td>
									<td>{product.stock}</td>
									<td>
										<span
											className={`${styles.status} ${getStatusClass(product.status)}`}
										>
											{product.status}
										</span>
									</td>
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