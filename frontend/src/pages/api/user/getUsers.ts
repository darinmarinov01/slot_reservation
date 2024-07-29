'use server'

// Next.js imports for API routes
import type { NextApiRequest, NextApiResponse } from 'next'

// Internal imports
import { getUsers } from '@/actions/user/getUsers'
import { ApiError } from '@/common/types/slots-types'
import { User } from '@/common/types/user-types'

// API route handler
export default async function handler(req: NextApiRequest, res: NextApiResponse<User[] | ApiError | null>) {
    // Validate request method
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ message: `Method ${req.method} not allowed` });
        return;
    }

    try {
        const users = await getUsers()

        if (users && users.length) {
            res.status(200).json(users)
        } else {
            res.status(404).json(null)
        }
    } catch (error) {
        const apiError: ApiError = { message: (error as Error).message }
        res.status(500).json(apiError)
    }
}
