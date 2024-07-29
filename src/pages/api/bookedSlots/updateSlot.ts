'use server'

// Internal imports
import { updateSlot } from '@/actions/bookedSlots/updateSlot'
import { ApiError, BookedSlots } from '@/common/types/slots-types'

// Next.js imports for API routes
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<BookedSlots | ApiError | null>) {

    // Validate request method
    if (req.method !== 'PUT') {
        res.setHeader('Allow', ['PUT'])
        res.status(405).json({ message: `Method ${req.method} not allowed` })
        return
    }

    const data: BookedSlots | null = req.body

    if (!data || !data.id) {
        res.status(400).json({ message: "Missing or invalid data" })
        return
    }

    try {
        const result = await updateSlot(data)

        if ('message' in result) {
            res.status(409).json(result)
        } else {
            res.status(200).json(result) // 200 OK is more appropriate than 201 Created for a PUT operation
        }
    } catch (error) {
        const apiError: ApiError = { message: (error as Error).message }
        res.status(500).json(apiError)
    }
}
