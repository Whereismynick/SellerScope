import { useState } from "react"
import styles from "./Products.module.css"
import {
	type NewProduct,
	type Product,
	type ProductStatus
} from "../types/product"
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

type UpdateProduct = {
	id: string
	data: Partial<NewProduct>
}

const fetchProducts = async (): Promise<Product[]> => {
	const response = await fetch("http://localhost:3001/api/products")

	if (!response.ok) {
		throw new Error("Failed to load products")
	}

	return response.json()
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

const deleteProduct = async (id: string): Promise<void> => {
	const response = await fetch(`http://localhost:3001/api/products/${id}`, {
		method: "DELETE"
	})

	if (!response.ok) {
		throw new Error("Failed to delete product")
	}
}

const updateProduct = async ({
	id,
	data
}: UpdateProduct): Promise<Product> => {
	const response = await fetch(`http://localhost:3001/api/products/${id}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(data)
	})

	if (!response.ok) {
		throw new Error("Failed to update product")
	}

	return response.json()
}

const Products = () => {
	const [search, setSearch] = useState("")
	const [selected, setSelected] = useState("All")
	const [editingProduct, setEditingProduct] = useState<Product | null>(null)

	const queryClient = useQueryClient()

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

	const createProductMutation = useMutation({
		mutationFn: createProduct,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["products"] })
			reset()
		}
	})

	const deleteProductMutation = useMutation({
		mutationFn: deleteProduct,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["products"] })
		}
	})

	const updateProductMutation = useMutation({
		mutationFn: updateProduct,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["products"] })
			setEditingProduct(null)
			reset()
		}
	})

	const handleDelete = (id: string) => {
		const confirmed = window.confirm("Delete this product?")

		if (!confirmed) return

		deleteProductMutation.mutate(id)
	}

	const handleEdit = (product: Product) => {
		setEditingProduct(product)

		reset({
			name: product.name,
			price: product.price,
			stock: product.stock,
			status: product.status
		})
	}

	const handleCancelEdit = () => {
		setEditingProduct(null)

		reset({
			name: "",
			price: 0,
			stock: 0,
			status: "Active"
		})
	}

	const onSubmit = (data: ProductForm) => {
		if (editingProduct) {
			updateProductMutation.mutate({
				id: editingProduct._id,
				data
			})

			return
		}

		createProductMutation.mutate(data)
	}

	const filteredProducts = items.filter(
		item =>
			item.name.toLowerCase().includes(search.toLowerCase()) &&
			(selected === "All" || item.status === selected)
	)

	const isFormPending =
		createProductMutation.isPending || updateProductMutation.isPending

	return (
		<div className={styles.page}>
			<div className={styles.addProductCard}>
				<h3>{editingProduct ? "Edit product" : "Add product"}</h3>

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
						disabled={isFormPending}
					>
						{editingProduct
							? updateProductMutation.isPending
								? "Saving..."
								: "Save changes"
							: createProductMutation.isPending
								? "Adding..."
								: "Add product"}
					</button>

					{editingProduct && (
						<button
							type="button"
							onClick={handleCancelEdit}
							disabled={updateProductMutation.isPending}
						>
							Cancel
						</button>
					)}
				</form>

				{createProductMutation.error && (
					<p className={styles.createError}>
						{createProductMutation.error.message}
					</p>
				)}

				{updateProductMutation.error && (
					<p className={styles.createError}>
						{updateProductMutation.error.message}
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
						<button onClick={() => refetch()}>
							Retry
						</button>
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
								<th>Actions</th>
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

									<td>
										{product.price.toLocaleString("ru-RU")} ₽
									</td>

									<td>{product.stock}</td>

									<td>
										<span
											className={`${styles.status} ${getStatusClass(
												product.status
											)}`}
										>
											{product.status}
										</span>
									</td>

									<td>
										<button
											onClick={() => handleEdit(product)}
											disabled={updateProductMutation.isPending}
										>
											Edit
										</button>

										<button
											onClick={() => handleDelete(product._id)}
											disabled={deleteProductMutation.isPending}
										>
											{deleteProductMutation.isPending
												? "Deleting..."
												: "Delete"}
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}

				{deleteProductMutation.error && (
					<p className={styles.createError}>
						{deleteProductMutation.error.message}
					</p>
				)}
			</div>
		</div>
	)
}

export default Products