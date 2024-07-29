'use server'

// Internal imports 
import { User } from '@/common/types/user-types'
import { ApiError } from '@/common/types/slots-types'
import { updateUserByEmail } from '@/actions/user/updateUserByEmail'

type EmainAndPassword = {
    email: string
    password: string
}

// Next.js imports for API routes
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { data }: { data: EmainAndPassword } = req.body

    try {
        const updatedUser = await updateUserByEmail(data)
        res.status(200).json(updatedUser)
    } catch (error) {
        const apiError: ApiError = { message: (error as Error).message }
        res.status(500).json(apiError)
    }
}