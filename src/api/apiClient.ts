import axios from "axios"

export const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL
})

apiClient.interceptors.request.use(config => {
	const token = localStorage.getItem("token")

	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}

	return config
})

apiClient.interceptors.response.use(
	response => response,
	error => {
		const isAuthRequest =
			error.config?.url?.includes("/auth/login") ||
			error.config?.url?.includes("/auth/register")

		if (
			error.response?.status === 401 &&
			!isAuthRequest
		) {
			localStorage.removeItem("token")
			localStorage.removeItem("user")
			window.location.href = "/login"
		}

		return Promise.reject(error)
	}
)