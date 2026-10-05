export type Currency = "RUB" | "USD" | "EUR"

export type AuthUser = {
	_id: string
	name: string
	email: string
	currency: Currency
}

export type AuthResponse = {
	_id: string
	name: string
	email: string
	currency: Currency
	token: string
}