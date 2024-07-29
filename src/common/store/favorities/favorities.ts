import { create } from 'zustand'
import { SlotProperties } from '@/common/types/slots-types'

type Store = {
	favoriteSlots: SlotProperties[]
	setFavoriteSlots: (slots: SlotProperties[] | []) => void
}

const useFavorities = create<Store>()((set) => ({
	favoriteSlots: [],
	setFavoriteSlots: (slots) => set({ favoriteSlots: slots }),
}))

export default useFavorities