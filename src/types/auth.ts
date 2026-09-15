export type AuthUser = {
	_id: string,
	name: string,
	email: string
}

export type AuthResponse = {
	_id: string,
	name: string,
	email: string,
	token: string
}