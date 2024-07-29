// Firebase imports
import 'firebase/firestore'
import { db } from '@/firebase/firebase-config'
import { doc, deleteDoc } from "firebase/firestore"
// Internal imports
import { SlotProperties, ApiError } from '@/common/types/slots-types'

// Function to delete a slot
export const deleteSlot = async (data: SlotProperties): Promise<SlotProperties | ApiError> => {
    if (!data || !data.id) {
        throw new Error("Invalid input data")
    }
    
    try {
        // Delete slot
        const slotDoc = doc(db, "slots", data.id);
        await deleteDoc(slotDoc);

        return data;
    } catch (error) {
        const errorMessage = (error as Error).message;
        console.error("Error deleting slot: ", errorMessage);
        return { message: errorMessage };
    }
};