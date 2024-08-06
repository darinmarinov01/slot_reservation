// Firebase imports
import { db } from '@/firebase/firebase-config'
import { addDoc, collection, Timestamp } from "firebase/firestore"

// Internal imports
import { headers } from '@/common/constants'
import { User, LoginProviderType } from '@/common/types/user-types'

// Type for the error response
type ApiError = {
    message: string
}

// Function to create a new user
export const createUser = async (data: User): Promise<User | ApiError> => {
    try {
        // Check if the user already exists
        const existingUserRes = await fetch(`https://slot-reservation.vercel.app/api/user/getUser`, {
            body: JSON.stringify({ email: data.email }),
            headers: headers,
            method: 'POST',
        })

        const existingUser = await existingUserRes.json()

        if (existingUser.email) {
            return { message: "User already exists" }
        }

        // Add new user to Firestore
        await addDoc(collection(db, 'users'), {
            email: data.email,
            name: data.name,
            photoUrl: data.photoUrl || '',
            password: data.password || '',
            isDeleted: data.isDeleted,
            role: data.role,
            favoriteSlots: data.favoriteSlots,
            dateCreated: Timestamp.fromDate(new Date(data.dateCreated)),
            provider: data?.provider || LoginProviderType.PASSWORD_LOGIN
        })

        return data
    } catch (error) {
        console.error("Error creating user: ", error)
        return { message: (error as Error).message }
    }
}
