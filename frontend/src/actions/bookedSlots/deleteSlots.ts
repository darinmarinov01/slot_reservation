// Firebase imports
import 'firebase/firestore'
import { db } from '@/firebase/firebase-config'
import { doc, deleteDoc, query, collection, where, getDocs } from "firebase/firestore"
// Internal imports
import { BookedSlots, ApiError } from '@/common/types/slots-types'

// Function to delete a bookeds slots
export const deleteSlots = async (data: BookedSlots): Promise<BookedSlots[] | ApiError> => {
    if (!data || !data.id) {
        throw new Error("Invalid input data")
    }

    const slotDocRef = doc(db, "slots", data.id)
    const q = query(collection(db, 'bookedSlots'), where('slot', '==', slotDocRef))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
        console.log("No such document!")
        return []
    }
    
    try {
        // Delete booked slots
        querySnapshot.forEach(async (document) => {
            if (document.exists()) {
                const slotDoc = doc(db, "bookedSlots", document.id)
                await deleteDoc(slotDoc)
            }
        })

        return [data]
    } catch (error) {
        const errorMessage = (error as Error).message
        console.error("Error deleting booked slot: ", errorMessage)
        return { message: errorMessage }
    }
}