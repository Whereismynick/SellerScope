import { useState } from "react"
import type { SubmitEvent } from "react"
import { useAuth } from "../hooks/useAuth"
import axios from "axios"
import type { AuthResponse } from "../types/auth"
import { useNavigate } from "react-router-dom"


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
			const response = await axios.post<AuthResponse>(
				"http://localhost:3001/api/auth/login",
				{
					email,
					password
				}
			)
			login(response.data)
			navigate("/")
		} catch (error) {
			if (axios.isAxiosError(error)) {
				setError(error.response?.data?.message || "Invalid email or password")
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
				{error && <p>{error}</p>}
			</form>
		</div>
	)
}

export default Login