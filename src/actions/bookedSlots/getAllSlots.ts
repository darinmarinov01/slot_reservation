// Internal imports 
import { BookedSlots } from '@/common/types/slots-types'
import { getDocData } from '@/common/utils/index'

// Firebase imports
import { db } from '@/firebase/firebase-config'
import { collection, getDoc, getDocs } from "firebase/firestore"

// Function to get slots
export const getAllSlots = async (): Promise<BookedSlots[] | null> => {
    const querySnapshot = await getDocs(collection(db, "bookedSlots"))

    if (querySnapshot.empty) {
        console.log("No documents found!")
        return []
    }

    try {
        const bookdeSlots: BookedSlots[] = []

        await Promise.all(querySnapshot.docs.map(async (document) => {
            const slot = await getDoc(document.data().slot)
            const user = await getDoc(document.data().user)

            if (document.exists()) {
                const data = document.data()
                const bookdeSlot: BookedSlots = {
                    id: document.id,
                    slot: getDocData(slot),
                    user: getDocData(user),
                    startDate: data.startDate.toDate(),
                    endDate: data.endDate.toDate(),
                    description: data?.description || '',
                }
                bookdeSlots.push(bookdeSlot)
            } 
        }))

        return bookdeSlots.length > 0 ? bookdeSlots.sort((a, b) => new Date(b.startDate).getDate() - new Date(a.startDate).getDate()) : null
    } catch (error) {
        console.error("Error getting documents: ", error)
        throw new Error(`Failed to retrieve bookdeSlots: ${(error as Error).message}`)
    }
}