// Firebase imports
import { db } from '@/firebase/firebase-config'
import { doc, deleteDoc, query, collection, where, getDocs } from "firebase/firestore"
// Internal imports
import { ApiError } from '@/common/types/slots-types'

// Function to delete booked slots
export const deleteErrors = async (): Promise<[] | ApiError> => {

    const addDays = (date: Date, days: number) => {
        const newDate = new Date(date)
        newDate.setDate(date.getDate() - days)
        return newDate
    }

    const today = new Date()
    const queryDate = addDays(today, 10)

    const q = query(collection(db, 'errors'), where('dateCreated', '<', queryDate))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
        console.log("No such document!")
        return []
    }

    try {
        // Delete booked slots
        const deletePromises = querySnapshot.docs.map(async (document) => {
            const errorDoc = doc(db, "errors", document.id)
            await deleteDoc(errorDoc)
        })

        await Promise.all(deletePromises)

        return []
    } catch (error) {
        const errorMessage = (error as Error).message
        console.error("Error deleting error: ", errorMessage)
        return { message: errorMessage }
    }
}
