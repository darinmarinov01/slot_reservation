
// Firebase imporst
import 'firebase/firestore'
import { db } from '@/firebase/firebase-config'
import { SlotProperties, ApiError } from '@/common/types/slots-types'
import { doc, updateDoc, Timestamp } from "firebase/firestore"

// Function to Update a booked slot
export const updateSlot = async (data: SlotProperties): Promise<SlotProperties | ApiError> => {
    if (!data || !data.id) {
        throw new Error("Invalid input data")
    }

    try {
        const bookedSlotRef = doc(db, "slots", data.id)

        await updateDoc(bookedSlotRef, {
            location: data?.location || '',
            description: data?.description || '',
            dateCreated: Timestamp.fromDate(new Date()),
        })

        return data
    } catch (error) {
        console.error("Error updating booked slot: ", (error as Error).message)
        return { message: (error as Error).message }
    }
}