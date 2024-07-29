// Internal imports 
import { User } from '@/common/types/user-types'

// Firebase imports
import { db } from '@/firebase/firebase-config'
import { collection, getDocs, query, updateDoc, where } from "firebase/firestore"

type EmailAndPassword = {
    email: string
    password: string
}

// Function to update user password by email
export const updateUserByEmail = async (data: EmailAndPassword): Promise<User | null> => {
    if (!data || !data.email) {
        throw new Error("Invalid input data")
    }

    const userQuery = query(collection(db, 'users'), where('email', '==', data.email))
    const userDocs = await getDocs(userQuery)

    if (userDocs.empty) {
        throw new Error('User not found')
    }

    const userDoc = userDocs.docs[0]
    const userDocRef = userDoc.ref

    try {
        if(userDoc.data().password !== data.password) { 
            await updateDoc(userDocRef, {
                password: data.password
            })
        }

        const updatedUser = userDoc.data() as User
        return updatedUser
    } catch (error) {
        console.error("Error updating user password: ", error)
        throw new Error(`Failed to update password: ${(error as Error).message}`)
    }
}
