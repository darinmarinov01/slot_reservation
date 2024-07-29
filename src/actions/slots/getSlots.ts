// Internal imports 
import { SlotProperties } from '@/common/types/slots-types'

// Firebase imports
import { db } from '@/firebase/firebase-config'
import { collection, getDocs } from "firebase/firestore"


// Function to get slots
export const getSlots = async (): Promise<SlotProperties[] | null> => {
    const querySnapshot = await getDocs(collection(db, "slots"))

    if (querySnapshot.empty) {
        throw new Error("No documents found!")
    }

    try {
        const slots: SlotProperties[] = []

        querySnapshot.forEach((doc) => {
            if (doc.exists()) {
                const data = doc.data()
                const slot: SlotProperties = {
                    id: doc.id,
                    location: data.location,
                    description: data.description,
                    type: data.type
                }
                slots.push(slot)
            }
        })

        return slots.length > 0 ? slots : null
    } catch (error) {
        console.error("Error getting documents: ", error)
        throw new Error(`Failed to retrieve slots: ${(error as Error).message}`)
    }
}