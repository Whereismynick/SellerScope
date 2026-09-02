export type Product = {
  _id: string 
  name: string
  price: number
  stock: number
  status: ProductStatus
}

export type ProductStatus = "Active" | "Low Stock" | "Out of Stock"

export type NewProduct = Omit<Product, "_id">