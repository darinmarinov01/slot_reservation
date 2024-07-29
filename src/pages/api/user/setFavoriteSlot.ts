'use server'

// Internal imports 
import { User } from '@/common/types/user-types'
import { SlotProperties, ApiError } from '@/common/types/slots-types'
import { setFavoriteSlot } from '@/actions/user/setFavoriteSlot'

// Next.js imports for API routes
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { user, slot, toggle }: { user: User, slot: SlotProperties, toggle: boolean } = req.body

    try {
        const updatedUser = await setFavoriteSlot(user, slot, toggle)
        res.status(200).json(updatedUser)
    } catch (error) {
        const apiError: ApiError = { message: (error as Error).message }
        res.status(500).json(apiError)
    }
}