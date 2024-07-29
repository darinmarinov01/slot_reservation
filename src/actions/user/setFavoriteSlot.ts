// Internal imports 
import { User } from '@/common/types/user-types'
import { SlotProperties, ApiError } from '@/common/types/slots-types'

// Firebase imports
import 'firebase/firestore'
import { db } from '@/firebase/firebase-config'
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore"

export const setFavoriteSlot = async (user: User, slot: SlotProperties, toggle: boolean): Promise<User> => {
    const userRef = user && user.id ? doc(db, "users", user.id) : null

    if (!userRef) {
        throw new Error("User reference is null")
    }

    try {
        if (toggle) {
            await updateDoc(userRef, {
                favoriteSlots: arrayRemove(slot)
            })
        } else {
            await updateDoc(userRef, {
                favoriteSlots: arrayUnion(slot)
            })
        }

        const docSnap = await getDoc(userRef)

        if (!docSnap.exists()) {
            throw new Error("No such document!")
        }

        const userData = docSnap.data()

        if (userData) {
            return userData as User
        } else {
            throw new Error("No user data found!")
        }
    } catch (error) {
        throw error
    }
}
