// Firebase imports
import 'firebase/firestore'
import { db } from '@/firebase/firebase-config'
import { doc, deleteDoc, query, collection, where, getDocs } from "firebase/firestore"
// Internal imports
import { BookedSlots, ApiError } from '@/common/types/slots-types'
import { User } from '@/common/types/user-types';

// Function to delete a bookeds slots
export const deleteBookedSlotsByUser = async (data: User): Promise<BookedSlots[] | ApiError> => {
    if (!data || !data.id) {
        throw new Error("Invalid input data")
    }

    const userDocRef = doc(db, "users", data.id)
    const q = query(collection(db, 'bookedSlots'), where('user', '==', userDocRef))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
        console.log("No such document!")
        return []
    }
    
    try {
        // Delete booked slots
        querySnapshot.forEach(async (document) => {
            if (document.exists()) {
                const slotDoc = doc(db, "bookedSlots", document.id);
                await deleteDoc(slotDoc);
            }
        })

        return []
    } catch (error) {
        const errorMessage = (error as Error).message;
        console.error("Error deleting booked slot: ", errorMessage);
        return { message: errorMessage };
    }
};