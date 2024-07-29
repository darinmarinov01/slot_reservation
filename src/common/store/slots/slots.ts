import { create } from 'zustand'

type Store = {
	slotsArray: []
	setSlotsArray: () => void
}

const useSlots = create<Store>()((set) => ({
	slotsArray: [],
	setSlotsArray: () => set((state) => ({ slotsArray: state.slotsArray })),
}))  

export default useSlots