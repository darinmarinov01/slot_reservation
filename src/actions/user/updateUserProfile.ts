// Internal imports 
import { User } from '@/common/types/user-types'

// Firebase imports
import 'firebase/firestore'
import { db } from '@/firebase/firebase-config'
import { doc, updateDoc } from "firebase/firestore"

export const updateUserProfile = async (user: User): Promise<User> => {
    const userRef = user && user.id ? doc(db, 'users', user.id) : null

    if (!userRef) {
        throw new Error("User reference is null")
    }

    try {
        await updateDoc(userRef, {
            photoUrl: user.photoUrl,
            name: user.name,
            password: user.password,
            email: user.email,
        })

        return user
    } catch (error) {
        throw error
    }
}
