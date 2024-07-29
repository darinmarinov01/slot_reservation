// Firebase imports
import 'firebase/firestore'
import { db } from '@/firebase/firebase-config'
import { doc, deleteDoc, updateDoc } from "firebase/firestore"
// Internal imports
import { ApiError } from '@/common/types/slots-types'
import { User } from '@/common/types/user-types'

// Function to delete a user
export const deleteUser = async (data: User): Promise<User | ApiError> => {
    if (!data || !data.id) {
        throw new Error("Invalid input data")
    }
    
    try {
        // Delete user from database
        const userDocRef = doc(db, "users", data.id);

        await updateDoc(userDocRef, {
            isDeleted: true
        })
        
        console.log('User deleted successfully', data)
        return data;
    } catch (error) {
        const errorMessage = (error as Error).message;
        console.error("Error deleting user: ", errorMessage);
        return { message: errorMessage };
    }
};