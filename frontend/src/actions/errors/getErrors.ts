// Internal imports 
import { FirebaseErrorMessageWithId } from '@/common/types/firebase-errors';
// Firebase imports
import { db } from '@/firebase/firebase-config'
import { collection, getDocs } from "firebase/firestore"

// Function to get slots
export const getErrors = async (): Promise<FirebaseErrorMessageWithId[] | null> => {
    const querySnapshot = await getDocs(collection(db, "errors"))

    if (querySnapshot.empty) {
        throw new Error("No documents found!")
    }

    try {
        const errors: FirebaseErrorMessageWithId[] = []

        querySnapshot.forEach((doc) => {
            if (doc.exists()) {
                const data = doc.data()
                const error: FirebaseErrorMessageWithId = {
                    id: doc.id,
                    code: data.code,
                    dateCreated: data.dateCreated.toDate(),
                    message: data.message,
                    user: data.user
                }
                errors.push(error)
            }
        })

        return errors.length > 0 ? errors.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()) : null
    } catch (error) {
        console.error("Error getting documents: ", error)
        throw new Error(`Failed to retrieve slots: ${(error as Error).message}`)
    }
}