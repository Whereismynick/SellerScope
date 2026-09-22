import { useEffect, useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import styles from "./Settings.module.css"
import { apiClient } from "../api/apiClient"
import {
	useMutation,
	useQuery,
	useQueryClient
} from "@tanstack/react-query"
import { useAuth } from "../hooks/useAuth"

type SettingsData = {
	name: string
	email: string
	storeName: string
	currency: "RUB" | "USD" | "EUR"
	notifications: boolean
}

const fetchSettings = async (): Promise<SettingsData> => {
	const response = await apiClient.get<SettingsData>("/settings")
	return response.data
}

const updateSettings = async (
	data: SettingsData
): Promise<SettingsData> => {
	const response = await apiClient.patch<SettingsData>(
		"/settings",
		data
	)

	return response.data
}

const settingsSchema = z.object({
	name: z.string().trim().min(1, "Name is required"),
	storeName: z.string().trim().min(1, "Store name is required"),
	email: z.email("Enter a valid email"),
	currency: z.enum(["RUB", "USD", "EUR"]),
	notifications: z.boolean()
})

type SettingsForm = z.infer<typeof settingsSchema>

const Settings = () => {
	const [saved, setSaved] = useState(false)
	const { updateUser } = useAuth()
	const queryClient = useQueryClient()

	const {
		data: settings,
		isLoading,
		error
	} = useQuery({
		queryKey: ["settings"],
		queryFn: fetchSettings
	})

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isDirty }
	} = useForm<SettingsForm>({
		resolver: zodResolver(settingsSchema),
		defaultValues: {
			name: "",
			storeName: "",
			email: "",
			currency: "RUB",
			notifications: true
		}
	})

	const updateSettingsMutation = useMutation({
		mutationFn: updateSettings,
		onSuccess: updatedSettings => {
			queryClient.setQueryData(
				["settings"],
				updatedSettings
			)

			reset(updatedSettings)

			updateUser({
				name: updatedSettings.name,
				email: updatedSettings.email
			})

			setSaved(true)
		}
	})

	useEffect(() => {
		if (settings) {
			reset(settings)
		}
	}, [settings, reset])

	const onSubmit = (data: SettingsForm) => {
		setSaved(false)
		updateSettingsMutation.mutate(data)
	}

	if (isLoading) {
		return <p>Loading settings...</p>
	}

	if (error) {
		return <p>Failed to load settings</p>
	}

	return (
		<div className={styles.page}>
			<form
				className={styles.form}
				onSubmit={handleSubmit(onSubmit)}
				noValidate
			>
				<label className={styles.field}>
					Name
					<input
						className={styles.input}
						{...register("name")}
					/>
					{errors.name && (
						<span className={styles.error}>
							{errors.name.message}
						</span>
					)}
				</label>

				<label className={styles.field}>
					Store name
					<input
						className={styles.input}
						{...register("storeName")}
					/>
					{errors.storeName && (
						<span className={styles.error}>
							{errors.storeName.message}
						</span>
					)}
				</label>

				<label className={styles.field}>
					Email
					<input
						className={styles.input}
						type="email"
						{...register("email")}
					/>
					{errors.email && (
						<span className={styles.error}>
							{errors.email.message}
						</span>
					)}
				</label>

				<label className={styles.field}>
					Currency
					<select
						className={styles.select}
						{...register("currency")}
					>
						<option value="RUB">RUB</option>
						<option value="USD">USD</option>
						<option value="EUR">EUR</option>
					</select>
				</label>

				<label className={styles.checkboxField}>
					Notifications
					<input
						type="checkbox"
						{...register("notifications")}
					/>
				</label>

				<button
					className={styles.button}
					type="submit"
					disabled={
						!isDirty ||
						updateSettingsMutation.isPending
					}
				>
					{updateSettingsMutation.isPending
						? "Saving..."
						: "Save changes"}
				</button>

				{saved && !isDirty && (
					<span className={styles.success}>
						Settings saved successfully
					</span>
				)}

				{updateSettingsMutation.error && (
					<span className={styles.error}>
						Failed to save settings
					</span>
				)}
			</form>
		</div>
	)
}

export default Settings