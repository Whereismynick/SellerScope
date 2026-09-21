import { useState } from "react"
import type { SubmitEvent } from "react"
import { useAuth } from "../hooks/useAuth"
import { apiClient } from "../api/apiClient"
import type { AuthResponse } from "../types/auth"
import { isAxiosError } from "axios"
import { Link, useNavigate } from "react-router-dom"
import styles from "./Auth.module.css"

const Login = () => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")
	const [isLoading, setIsLoading] = useState(false)

	const { login } = useAuth()
	const navigate = useNavigate()

	const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()
		setError("")

		try {
			setIsLoading(true)
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
		} finally {
			setIsLoading(false)
		}

	}

	return (
		<div className={styles.page}>
			<div className={styles.card}>
				<h1 className={styles.title}>Welcome back</h1>
				<p className={styles.subtitle}>
					Sign in to continue to SellerScope
				</p>

				<form
					className={styles.form}
					onSubmit={handleSubmit}
				>
					<label className={styles.field}>
						<span className={styles.label}>Email</span>

						<input
							className={styles.input}
							type="email"
							value={email}
							onChange={e => setEmail(e.target.value)}
							placeholder="Email"
						/>
					</label>

					<label className={styles.field}>
						<span className={styles.label}>Password</span>

						<input
							className={styles.input}
							type="password"
							value={password}
							onChange={e => setPassword(e.target.value)}
							placeholder="Password"
						/>
					</label>

					<button
						className={styles.button}
						type="submit"
						disabled={isLoading}
					>
						{isLoading ? "Signing in..." : "Sign in"}
					</button>

					{error && (
						<p className={styles.error}>
							{error}
						</p>
					)}

					<p className={styles.footer}>
						Don't have an account?{" "}
						<Link
							className={styles.link}
							to="/register"
						>
							Create account
						</Link>
					</p>
				</form>
			</div>
		</div>
	)
}

export default Login