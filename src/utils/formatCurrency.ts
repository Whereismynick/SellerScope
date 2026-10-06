import type { Currency } from "../types/auth"

export const formatCurrency = (
	value: number,
	currency: Currency
) => {
	return new Intl.NumberFormat("ru-RU", {
		style: "currency",
		currency,
		minimumFractionDigits: 0,
		maximumFractionDigits: 2
	}).format(value)
}