import { useState } from "react"
import type { SubmitEvent } from "react"
import type { AuthResponse } from "../types/auth"
import { useAuth } from "../hooks/useAuth"
import { useNavigate, Link } from "react-router-dom"
import { isAxiosError } from "axios"
import { apiClient } from "../api/apiClient"

const Register = () => {
	const [name, setName] = useState("")
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
				"/auth/register",
				{
					name,
					email,
					password
				}
			)

			login(response.data)
			navigate("/")
		} catch (error) {
			if (isAxiosError(error)) {
				setError(error.response?.data?.message || "Registration failed")
				return
			}

			setError("Registration failed")
		}
	}

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					value={name}
					onChange={e => setName(e.target.value)}
					placeholder="Name"
				/>

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

				<button type="submit">Зарегистрироваться</button>
				<p>
					Уже есть аккаунт? <Link to="/login">Войти</Link>
				</p>
				{error && <p>{error}</p>}
			</form>
		</div>
	)
}

export default Register