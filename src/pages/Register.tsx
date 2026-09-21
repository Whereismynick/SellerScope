import { useState } from "react"
import type { SubmitEvent } from "react"
import type { AuthResponse } from "../types/auth"
import { useAuth } from "../hooks/useAuth"
import { useNavigate, Link } from "react-router-dom"
import { isAxiosError } from "axios"
import { apiClient } from "../api/apiClient"
import styles from "./Auth.module.css"

const Register = () => {
	const [name, setName] = useState("")
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
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className={styles.page}>
			<div className={styles.card}>
				<h1 className={styles.title}>Create account</h1>

				<p className={styles.subtitle}>
					Create your SellerScope account
				</p>

				<form
					className={styles.form}
					onSubmit={handleSubmit}
				>
					<label className={styles.field}>
						<span className={styles.label}>Name</span>

						<input
							className={styles.input}
							type="text"
							value={name}
							onChange={e => setName(e.target.value)}
							placeholder="Name"
						/>
					</label>

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
						{isLoading ? "Creating account..." : "Create account"}
					</button>

					{error && (
						<p className={styles.error}>
							{error}
						</p>
					)}

					<p className={styles.footer}>
						Already have an account?{" "}
						<Link
							className={styles.link}
							to="/login"
						>
							Sign in
						</Link>
					</p>
				</form>
			</div>
		</div>
	)
}

export default Register