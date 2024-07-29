'use server'

// Internal imports
import { createUser } from '@/actions/user/createUser'
import { ApiError } from '@/common/types/slots-types'
import { User } from '@/common/types/user-types'
// Next.js imports for API routes
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<User | ApiError | null>) {
    const data: User = req.body

    if (!data.email) {
        res.status(400).json({ message: "Email is required" })
        return
    }

    try {
        const result = await createUser(data)

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