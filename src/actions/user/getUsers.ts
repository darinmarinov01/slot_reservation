// Firebase imports
import { db } from '@/firebase/firebase-config'
import { User } from '@/common/types/user-types'
import { collection, getDocs } from "firebase/firestore"

// Function to get all users
export const getUsers = async (): Promise<User[] | null> => {
    const querySnapshot = await getDocs(collection(db, "users"))

    if (querySnapshot.empty) {
        console.log("No documents found!")
        return []
    }

    try {
        const users: User[] = []

        querySnapshot.forEach((doc) => {
            if (doc.exists()) {
                const data = doc.data()
                const user: User = {
                    id: doc.id,
                    ...data as User,
                    dateCreated: data.dateCreated.toDate(),
                }

                users.push(user)
            }
        })

        return users
    } catch (error) {
        console.error("Error getting document: ", error)
        throw error
    }
}
