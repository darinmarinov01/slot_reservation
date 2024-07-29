import { create } from 'zustand'
import { AuthUser, User } from '@/common/types/user-types'

export const useUserStore = create<AuthUser>((set) => ({
	user: null,
	setUser: (user: User | null) => set({ user: user }),
}))

export default useUserStore