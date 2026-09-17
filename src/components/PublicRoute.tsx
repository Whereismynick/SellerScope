import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const PublicRoute = () => {
	const { token } = useAuth()

	if (token) {
		return <Navigate to="/" replace />
	}

	return <Outlet />
}

export default PublicRoute