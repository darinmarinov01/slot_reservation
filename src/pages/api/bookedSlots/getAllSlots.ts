'use server'

// Internal imports
import { getAllSlots } from '@/actions/bookedSlots/getAllSlots'
import { ApiError, BookedSlots } from '@/common/types/slots-types'

// Next.js imports for API routes
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<BookedSlots[] | ApiError | null>) {
    try {
        const bookdeSlots = await getAllSlots()

        // If slots are found, respond with the slots
        if (bookdeSlots) {
            res.status(200).json(bookdeSlots)
        } else {
            res.status(404).json(null)
        }
    } catch (error) {
        // Handle errors and respond with an error message
        const apiError: ApiError = { message: (error as Error).message }
        res.status(500).json(apiError)
    }
}
