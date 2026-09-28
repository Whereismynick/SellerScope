import "dotenv/config"

const getRequiredEnv = (name: string): string => {
	const value = process.env[name]

	if (!value) {
		throw new Error(`${name} is not defined`)
	}

	return value
}

export const MONGODB_URI = getRequiredEnv("MONGODB_URI")
export const JWT_SECRET = getRequiredEnv("JWT_SECRET")
export const PORT = Number(process.env.PORT) || 3001