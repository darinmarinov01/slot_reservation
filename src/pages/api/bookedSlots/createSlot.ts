'use server'

// Internal imports
import { createSlot } from '@/actions/bookedSlots/createSlot'
import { ApiError, BookedSlots, SlotProperties } from '@/common/types/slots-types'
import { User } from '@/common/types/user-types'

// Next.js imports for API routes
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<BookedSlots | ApiError | null>) {
    const data: BookedSlots = req.body
    const { user, slot }: { user: User, slot: SlotProperties } = req.body

    if (!user || !slot) {
        res.status(400).json({ message: "User and Slot are required" })
        return
    }

    try {
        const result = await createSlot(data)

        if ('message' in result) {
            res.status(409).json(result)
        } else {
            res.status(201).json(result)
        }
    } catch (error) {
        const apiError: ApiError = { message: (error as Error).message }
        res.status(500).json(apiError)
    }
}
