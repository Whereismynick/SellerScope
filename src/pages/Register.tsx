import { useState } from "react"
import type { SubmitEvent } from "react"
import axios from "axios"
import type { AuthResponse } from "../types/auth"
import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"

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
			const response = await axios.post<AuthResponse>(
				"http://localhost:3001/api/auth/register",
				{
					name,
					email,
					password
				}
			)

			login(response.data)
			navigate("/")
		} catch (error) {
			if (axios.isAxiosError(error)) {
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
				{error && <p>{error}</p>}
			</form>
		</div>
	)
}

export default Register