// Firebase imports
import 'firebase/firestore'
import { db } from '@/firebase/firebase-config'
import { addDoc, collection, Timestamp } from "firebase/firestore"
// Internal imports
import { ApiError } from '@/common/types/slots-types'
import { FirebaseError } from '@/common/types/firebase-errors'

// Function to create a new slot
export const createError = async (data: FirebaseError): Promise<FirebaseError | ApiError> => {
    if (!data.code) {
        throw new Error("Invalid input data")
    }
    
    try {
        // Add new slot to Firestore
        await addDoc(collection(db, 'errors'), {
            code: data.code,
            message: data.message,
            user: (data as any).user || 'unknown',
            dateCreated: Timestamp.fromDate(new Date()),
          })

        return data
    } catch (error) {
        console.error("Error creating slot: ", (error as Error).message )
        return { message: (error as Error).message }
    }
}