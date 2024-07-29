// Firebase imports
import 'firebase/firestore'
import { db } from '@/firebase/firebase-config'
import { addDoc, collection, doc, Timestamp } from "firebase/firestore"
// Internal imports
import { BookedSlots, ApiError } from '@/common/types/slots-types'

// Function to create a new slot
export const createSlot = async (data: any): Promise<BookedSlots | ApiError> => {
    if (!data.slot?.id || !data.user?.id || !data.startDate || !data.endDate) {
        throw new Error("Invalid input data")
    }
    
    try {
        const slotDoc = doc(db, 'slots', data.slot.id)
        const userDoc = doc(db, 'users', data.user.id)

        // Add new booked slot to Firestore
        await addDoc(collection(db, 'bookedSlots'), {
            slot: slotDoc,
            user: userDoc,
            startDate: Timestamp.fromDate(new Date(data.startDate)),
            endDate: Timestamp.fromDate(new Date(data.endDate)),
            description: data.description || ''
          })

        return data
    } catch (error) {
        console.error("Error creating booked slot: ", (error as Error).message )
        return { message: (error as Error).message }
    }
}