// Firebase imports
import 'firebase/firestore'
import { db } from '@/firebase/firebase-config'
import { doc, deleteDoc } from "firebase/firestore"
// Internal imports
import { BookedSlots, ApiError } from '@/common/types/slots-types'

// Function to delete a slot
export const deleteSlot = async (data: BookedSlots): Promise<BookedSlots | ApiError> => {
    if (!data || !data.id) {
        throw new Error("Invalid input data")
    }
    
    try {
        // Delete slot
        const slotDoc = doc(db, "bookedSlots", data.id)
        await deleteDoc(slotDoc)

        return data
    } catch (error) {
        const errorMessage = (error as Error).message
        console.error("Error deleting booked slot: ", errorMessage)
        return { message: errorMessage }
    }
}