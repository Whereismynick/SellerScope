import type { Currency } from "../types/auth"

export const formatCurrency = (
	value: number,
	currency: Currency
) => {
	return new Intl.NumberFormat("ru-RU", {
		style: "currency",
		currency,
		maximumFractionDigits: 0
	}).format(value)
}