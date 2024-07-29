// Internal imports 
import { BookedSlots } from '@/common/types/slots-types'
import { getDocData } from '@/common/utils/index'
import { User } from '@/common/types/user-types'

// Firebase imports
import { db } from '@/firebase/firebase-config'
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"

// Function to get slots
export const getAllSlotsByUser = async (user: User): Promise<BookedSlots[]> => {
    if (!user || !user.id || !user.email) {
        throw new Error("Invalid input data")
    }

    const userDocRef = query(collection(db, 'users'), where('email', '==', user.email))
    const userDocs = await getDocs(userDocRef)

    if (userDocs.empty) {
        throw new Error('User not found')
    }

    const userId = userDocs.docs[0].id
    const slotsQuery = query(collection(db, "bookedSlots"), where("user", "==", doc(db, 'users', userId)))
    const querySnapshot = await getDocs(slotsQuery)

    if (querySnapshot.empty) {
        console.log("No documents found!")
        return []
    }

    try {
        const data = await Promise.all(querySnapshot.docs.map(async (document) => {
            const slotDoc = await getDoc(document.data().slot)
            const userDoc = await getDoc(document.data().user)

            if (slotDoc.exists() && userDoc.exists()) {
                const docData: BookedSlots = {
                    id: document.id,
                    user: getDocData(userDoc),
                    slot: getDocData(slotDoc),
                    startDate: document.data().startDate.toDate(),
                    endDate: document.data().endDate.toDate(),
                    description: document.data().description
                }

                return docData
            }
            return null
        }))

        // Filter out null values
        return data.filter((slot): slot is BookedSlots => slot !== null)
    } catch (error) {
        console.error("Error getting documents: ", error)
        throw new Error(`Failed to retrieve bookedSlots by user: ${(error as Error).message}`)
    }
}
