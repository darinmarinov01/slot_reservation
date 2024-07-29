'use server'

// Internal imports 
import { User } from '@/common/types/user-types'
import { ApiError } from '@/common/types/slots-types'
import { updateUserProfile } from '@/actions/user/updateUserProfile'

// Next.js imports for API routes
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { user }: { user: User } = req.body

    try {
        const updatedUser = await updateUserProfile(user)
        res.status(200).json(updatedUser)
    } catch (error) {
        const apiError: ApiError = { message: (error as Error).message }
        res.status(500).json(apiError)
    }
}