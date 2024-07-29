import { create } from 'zustand'

type Store = {
	error: string | null
	setError: (error: string | null) => void
}

const useErrorStore = create<Store>()((set) => ({
	error: null,
	setError: (error: string | null) => set({ error: error }),
}))

export default useErrorStore