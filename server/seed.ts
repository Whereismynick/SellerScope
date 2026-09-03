import mongoose from "mongoose"
import dotenv from "dotenv"
import { OrderModel } from "./models/Order"
import { InventoryItemModel } from "./models/Inventory"

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI

const orders = [
	{
		orderNumber: 1001,
		customer: "Anna Petrova",
		date: "2026-08-18",
		amount: 12900,
		status: "Paid"
	},
	{
		orderNumber: 1002,
		customer: "Max Orlov",
		date: "2026-08-18",
		amount: 8400,
		status: "Pending"
	},
	{
		orderNumber: 1003,
		customer: "Dmitry Ivanov",
		date: "2026-08-17",
		amount: 21900,
		status: "Paid"
	},
	{
		orderNumber: 1004,
		customer: "Olga Smirnova",
		date: "2026-08-17",
		amount: 5600,
		status: "Cancelled"
	},
	{
		orderNumber: 1005,
		customer: "Alex Morozov",
		date: "2026-08-16",
		amount: 17400,
		status: "Paid"
	},
	{
		orderNumber: 1006,
		customer: "Maria Volkova",
		date: "2026-08-16",
		amount: 9200,
		status: "Pending"
	}
]

const inventory = [
	{
		name: "iPhone 15 Pro",
		sku: "APL-IP15P",
		stock: 24,
		reserved: 5
	},
	{
		name: "MacBook Air M3",
		sku: "APL-MBA-M3",
		stock: 8,
		reserved: 3
	},
	{
		name: "AirPods Pro",
		sku: "APL-APP2",
		stock: 41,
		reserved: 12
	},
	{
		name: "Apple Watch Series 9",
		sku: "APL-AW9",
		stock: 7,
		reserved: 2
	},
	{
		name: "USB-C Hub",
		sku: "ACC-USBC-HUB",
		stock: 14,
		reserved: 6
	},
	{
		name: "MacBook Stand",
		sku: "ACC-MB-STAND",
		stock: 5,
		reserved: 1
	}
]

const seed = async () => {
	if (!MONGODB_URI) {
		throw new Error("MONGODB_URI is not defined")
	}

	try {
		await mongoose.connect(MONGODB_URI, {
			dbName: "sellerscope"
		})

		await OrderModel.deleteMany({})
		await InventoryItemModel.deleteMany({})

		await OrderModel.insertMany(orders)
		await InventoryItemModel.insertMany(inventory)

		console.log("Seed completed")
	} catch (error) {
		console.error("Seed failed", error)
	} finally {
		await mongoose.disconnect()
	}
}

seed()