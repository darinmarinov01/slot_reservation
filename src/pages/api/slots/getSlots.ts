'use server'

// Next.js imports for API routes
import type { NextApiRequest, NextApiResponse } from 'next'

// Internal imports
import { getSlots } from '@/actions/slots/getSlots'
import { ApiError } from '@/common/types/slots-types'
import { SlotProperties } from '@/common/types/slots-types'

export default async function handler(req: NextApiRequest, res: NextApiResponse<SlotProperties[] | ApiError | null>) {
    try {
        const slots = await getSlots()

        // If slots are found, respond with the slots
        if (slots) {
            res.status(200).json(slots)
        } else {
            res.status(404).json(null)
        }
    } catch (error) {
        // Handle errors and respond with an error message
        const apiError: ApiError = { message: (error as Error).message }
        res.status(500).json(apiError)
    }
}