export type ProductStatus =
	| "Active"
	| "Low Stock"
	| "Out of Stock"

export const getProductStatus = (
	stock: number
): ProductStatus => {
	if (stock === 0) return "Out of Stock"
	if (stock < 10) return "Low Stock"

	return "Active"
}