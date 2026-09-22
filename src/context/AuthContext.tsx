import type { AuthResponse, AuthUser } from "../types/auth"
import { createContext, useState } from "react"
import type { ReactNode } from "react"

export type AuthContextValue = {
	user: AuthUser | null,
	token: string | null,
	login: (data: AuthResponse) => void,
	logout: () => void,
	updateUser: (data: Partial<AuthUser>) => void
}


export const AuthContext = createContext<AuthContextValue | null>(null)

type AuthProviderProps = {
	children: ReactNode
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
	const storedUser = localStorage.getItem("user")

	const [user, setUser] = useState<AuthUser | null>(
		storedUser ? JSON.parse(storedUser) : null
	)

	const [token, setToken] = useState<string | null>(
		localStorage.getItem("token")
	)
	const login = (data: AuthResponse) => {
		const { token, ...userData } = data
		setUser(userData)
		setToken(token)
		localStorage.setItem("user", JSON.stringify(userData))
		localStorage.setItem("token", token)
	}
	const logout = () => {
		setUser(null)
		setToken(null)
		localStorage.removeItem("user")
		localStorage.removeItem("token")
	}
	const updateUser = (data: Partial<AuthUser>) => {
	setUser(currentUser => {
		if(!currentUser) return currentUser

		const updatedUser = {
			...currentUser,
			...data
		}
		localStorage.setItem("user", JSON.stringify(updatedUser))
		return updatedUser
	})
}
	return (
		<AuthContext.Provider value={{
			user,
			token,
			login,
			logout,
			updateUser
		}}>{children}</AuthContext.Provider>
	)
}