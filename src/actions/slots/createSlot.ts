// Firebase imports
import 'firebase/firestore'
import { db } from '@/firebase/firebase-config'
import { addDoc, collection, Timestamp } from "firebase/firestore"
// Internal imports
import { ApiError, SlotProperties, SlotTypesEnum } from '@/common/types/slots-types'

// Function to create a new slot
export const createSlot = async (data: SlotProperties): Promise<SlotProperties | ApiError> => {
    if (!data.location) {
        throw new Error("Invalid input data")
    }
    
    try {
        // Add new slot to Firestore
        await addDoc(collection(db, 'slots'), {
            location: data.location,
            description: data.description || '',
            type: data.type || SlotTypesEnum.CAR,
            dateCreated: Timestamp.fromDate(new Date())
          })

        return data
    } catch (error) {
        console.error("Error creating slot: ", (error as Error).message )
        return { message: (error as Error).message }
    }
}