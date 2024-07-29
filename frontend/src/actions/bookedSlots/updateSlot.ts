
// Firebase imporst
import 'firebase/firestore'
import { db } from '@/firebase/firebase-config'
import { BookedSlots, ApiError } from '@/common/types/slots-types'
import { doc, updateDoc, Timestamp } from "firebase/firestore"

// Function to Update a booked slot
export const updateSlot = async (data: BookedSlots): Promise<BookedSlots | ApiError> => {
    if (!data || !data.id) {
        throw new Error("Invalid input data")
    }

    try {
        const bookedSlotRef = doc(db, "bookedSlots", data.id)

        await updateDoc(bookedSlotRef, {
            startDate: Timestamp.fromDate(new Date(data.startDate)),
            endDate: Timestamp.fromDate(new Date(data.endDate)),
            description: data?.description || ''
        })

        return data
    } catch (error) {
        console.error("Error updating booked slot: ", (error as Error).message)
        return { message: (error as Error).message }
    }
}