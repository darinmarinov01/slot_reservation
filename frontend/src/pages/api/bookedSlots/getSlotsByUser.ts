'use server'

// Internal imports
import { getAllSlotsByUser } from '@/actions/bookedSlots/getSlotsByUser'
import { User } from '@/common/types/user-types'
import { ApiError, BookedSlots } from '@/common/types/slots-types'

// Next.js imports for API routes
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<BookedSlots[] | ApiError | null>) {
    const { user }: { user: User } = req.body
    if (!user) {
        res.status(400).json({ message: "User is required" });
        return;
    }

    try {
        const bookdeSlotsByUser = await getAllSlotsByUser(user)

        // If slots are found, respond with the slots
        if (bookdeSlotsByUser) {
            res.status(200).json(bookdeSlotsByUser)
        } else {
            res.status(404).json(null)
        }
    } catch (error) {
        // Handle errors and respond with an error message
        const apiError: ApiError = { message: (error as Error).message }
        res.status(500).json(apiError)
    }
}
