// Internal imports 
import { BookedSlots } from '@/common/types/slots-types'
import { getDocData } from '@/common/utils/index'
import { User } from '@/common/types/user-types'

// Firebase imports
import { db } from '@/firebase/firebase-config'
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"

// Function to get slots
export const getAllSlotsByUser = async (user: User): Promise<BookedSlots[] | null> => {
    if (!user || !user.id) {
        throw new Error("Invalid input data")
    }

    const userDocRef = query(collection(db, 'users'), where('email', '==', user?.email))
    const userDoc = await getDocs(userDocRef)

    if (userDoc.empty) {
        throw new Error('User not found')
    }

    const q = query(collection(db, "bookedSlots"), where("user", "==", doc(db, 'users', userDoc.docs[0].id)))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
        console.log("No documents found!")
        return []
    }

    try {
        const data = await Promise.all(querySnapshot.docs.map(async (document) => {
            const slot = await getDoc(document.data().slot)
            const user = await getDoc(document.data().user)

            if (slot.exists() && user.exists()) {
                const docData: BookedSlots = {
                    id: document.id,
                    user: getDocData(user),
                    slot: getDocData(slot),
                    startDate: document.data().startDate.toDate(),
                    endDate: document.data().endDate.toDate(),
                    description: document.data().description
                }

                return docData
            }
            return null
        }))

        return data
    } catch (error) {
        console.error("Error getting documents: ", error)
        throw new Error(`Failed to retrieve bookdeSlots by user: ${(error as Error).message}`)
    }
}