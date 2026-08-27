import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import styles from "./Settings.module.css"

const settingsSchema = z.object({
	storeName: z.string().trim().min(1, "Store name is required"),
	email: z.email("Enter a valid email"),
	currency: z.enum(["RUB", "USD", "EUR"]),
	notifications: z.boolean()
})

type SettingsForm = z.infer<typeof settingsSchema>

const Settings = () => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isDirty }
	} = useForm<SettingsForm>({
		resolver: zodResolver(settingsSchema),
		defaultValues: {
			storeName: "SellerScope Store",
			email: "seller@example.com",
			currency: "RUB",
			notifications: true
		}
	})
	const [saved, setSaved] = useState(false)

	const onSubmit = (data: SettingsForm) => {
		console.log(data)
		setSaved(true)
		reset(data)
	}
	return (
		<div className={styles.page}>
			<form className={styles.form} 
			onSubmit={handleSubmit(onSubmit)}
			noValidate
			>
				<label className={styles.field}>Store name
					<input className={styles.input}
						{...register("storeName")}
					/>
					{errors.storeName && (<span className={styles.error}>{errors.storeName.message}</span>)}
				</label>
				<label className={styles.field}>Email
					<input className={styles.input}
					type="email"
					{...register("email")}
					/>
					{errors.email && (<span className={styles.error}>{errors.email.message}</span>)}
				</label>
				<label className={styles.field}>Currency
					<select className={styles.select}
					{...register("currency")}
					>
						<option value="RUB">RUB</option>
						<option value="USD">USD</option>
						<option value="EUR">EUR</option>
					</select>
				</label>
				<label className={styles.checkboxField}>Notifications
					<input
						type="checkbox"
						{...register("notifications")}
					/>
				</label>
				<button className={styles.button} type="submit">Save changes</button>
				{saved && !isDirty && (<span className={styles.success}>Settings saved successfully</span>)}
			</form>

		</div>
	)
}

export default Settings