import { useState } from "react"
import type { SubmitEvent } from "react"
import { useAuth } from "../hooks/useAuth"
import { apiClient } from "../api/apiClient"
import type { AuthResponse } from "../types/auth"
import { isAxiosError } from "axios"
import { Link, useNavigate } from "react-router-dom"

const Login = () => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")

	const { login } = useAuth()
	const navigate = useNavigate()

	const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()
		setError("")

		try {
			const response = await apiClient.post<AuthResponse>(
				"/auth/login",
				{
					email,
					password
				}
			)

			login(response.data)
			navigate("/")
		} catch (error) {
			if (isAxiosError(error)) {
				setError(
					error.response?.data?.message || "Invalid email or password"
				)
				return
			}

			setError("Invalid email or password")
		}
	}

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<input
					type="email"
					value={email}
					onChange={e => setEmail(e.target.value)}
					placeholder="Email"
				/>

				<input
					type="password"
					value={password}
					onChange={e => setPassword(e.target.value)}
					placeholder="Password"
				/>

				<button type="submit">Войти</button>
				<p>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
				{error && <p>{error}</p>}
			</form>
		</div>
	)
}

export default Login