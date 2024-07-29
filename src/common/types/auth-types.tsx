export interface AuthState {
	authToken: string | null
	setAuthToken: (token: string | null) => void
}