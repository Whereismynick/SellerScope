import { createContext } from "react"

import type {
	AuthResponse,
	AuthUser
} from "../types/auth"

export type AuthContextValue = {
	user: AuthUser | null
	token: string | null
	login: (data: AuthResponse) => void
	logout: () => void
	updateUser: (data: Partial<AuthUser>) => void
}

export const AuthContext =
	createContext<AuthContextValue | null>(null)