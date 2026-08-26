import { useState } from "react"
import styles from "./Settings.module.css"

type SettingsForm = {
	storeName: string
	email: string
	currency: string
	notifications: boolean
}

type SettingsErrors = {
	storeName?: string
	email?: string
}

const Settings = () => {
	const [form, setForm] = useState<SettingsForm>({
		storeName: "SellerScope Store",
		email: "seller@example.com",
		currency: "RUB",
		notifications: true
	})
	const [errors, setErrors] = useState<SettingsErrors>({})
	const [saved, setSaved] = useState(false)
	const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()
		const newErrors: SettingsErrors = {}
		if (!form.storeName.trim()) {
			newErrors.storeName = "Store name is required"
		}

		if (!form.email.trim()) {
			newErrors.email = "Email is required"
		} else if (!form.email.includes('@')) {
			newErrors.email = "Enter a valid email"
		}
		setErrors(newErrors)
		if (Object.keys(newErrors).length > 0) {
			setSaved(false)
			return
		}
		setSaved(true)
	}
	return (
		<div className={styles.page}>
			<form className={styles.form} onSubmit={handleSubmit}>
				<label className={styles.field}>Store name
					<input className={styles.input}
						value={form.storeName}
						onChange={e => {
							setForm({
								...form,
								storeName: e.target.value
							})
							setSaved(false)
						}}
					/>
					{errors.storeName && (<span className={styles.error}>{errors.storeName}</span>)}
				</label>
				<label className={styles.field}>Email
					<input className={styles.input}
						value={form.email}
						onChange={e => {
							setForm({
								...form,
								email: e.target.value
							})
							setSaved(false)
						}}
					/>
					{errors.email && (<span className={styles.error}>{errors.email}</span>)}
				</label>
				<label className={styles.field}>Currency
					<select className={styles.select}
						value={form.currency}
						onChange={e => {setForm({
							...form,
							currency: e.target.value
						})
						setSaved(false)
					}}
					>
						<option value="RUB">RUB</option>
						<option value="USD">USD</option>
						<option value="EUR">EUR</option>
					</select>
				</label>
				<label className={styles.checkboxField}>Notifications
					<input
						type="checkbox"
						checked={form.notifications}
						onChange={e => {
							setForm({
								...form,
								notifications: e.target.checked
							})
							setSaved(false)
						}}
					/>
				</label>
				<button className={styles.button} type="submit">Save changes</button>
				{saved && (<span className={styles.success}>Settings saved successfully</span>)}
			</form>

		</div>
	)
}

export default Settings