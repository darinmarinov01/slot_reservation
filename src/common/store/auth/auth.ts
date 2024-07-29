import { create } from 'zustand'
import { AuthState } from '@/common/types/auth-types'
  
export const useAuthStore = create<AuthState>((set) => ({
	authToken: null,
	setAuthToken: (token: string | null) => set({ authToken: token }),
}))

export default useAuthStore