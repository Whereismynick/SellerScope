import type { AuthResponse, AuthUser } from "../types/auth"
import { createContext, useState } from "react"
import type { ReactNode } from "react"

export type AuthContextValue = {
	user: AuthUser | null,
	token: string | null,
	login: (data: AuthResponse) => void
	logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

type AuthProviderProps = {
	children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<AuthUser | null>(null)
	const [token, setToken] = useState<string | null>(null)
	const login = (data: AuthResponse) => {
		const { token, ...userData } = data
		setUser(userData)
		setToken(token)
	}
	const logout = () => {
		setUser(null)
		setToken(null)
	}
	return (
		<AuthContext.Provider value={{
			user,
			token,
			login,
			logout
		}}>{children}</AuthContext.Provider>
	)
}