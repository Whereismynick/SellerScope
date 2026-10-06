export type ProductStatus =
	| "Active"
	| "Low Stock"
	| "Out of Stock"

export const getProductStatus = (
	stock: number,
	reserved = 0
): ProductStatus => {
	const available = stock - reserved

	if (available <= 0) return "Out of Stock"
	if (available < 10) return "Low Stock"

	return "Active"
}