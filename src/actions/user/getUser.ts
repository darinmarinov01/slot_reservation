// Firebase imports
import { db } from '@/firebase/firebase-config'
import { User } from '@/common/types/user-types'
import { collection, query, where, getDocs } from "firebase/firestore"

// Function to get a user by email
export const getUser = async (data: Pick<User, 'email'>): Promise<User | null> => {
    const q = query(collection(db, 'users'), where('email', '==', data.email))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
        throw new Error("No such document!")
    }

    try {
        let user: User | null = null
        querySnapshot.forEach((doc) => {
            if (doc.exists()) {
                if (doc.data().isDeleted) {
                    // throw new Error("The user is blocked") //TODO: to make all throw errors with some name convention and show to popup window
                    return null
                }
                user = { id: doc.id, ...doc.data() as User }
            }
        })

        return user
    } catch (error) {
        console.error("Error getting document: ", error)
        throw error
    }
}
