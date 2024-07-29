'use server'

// Next.js imports for API routes
import type { NextApiRequest, NextApiResponse } from 'next'

// Internal imports
import { getUser } from '@/actions/user/getUser'
import { ApiError } from '@/common/types/slots-types'
import { User } from '@/common/types/user-types'

// API route handler
export default async function handler(req: NextApiRequest, res: NextApiResponse<User | ApiError | null>) {
    const { email }: Pick<User, 'email'> = req.body

    if (!email) {
        res.status(400).json({ message: "Email is required" })
        return
    }

    try {
        const user = await getUser({ email })

        if (user) {
            res.status(200).json(user)
        } else {
            res.status(404).json(null)
        }
    } catch (error) {
        console.log('error =>', error)
        const apiError: ApiError = { message: (error as Error).message }
        res.status(500).json(apiError)
    }
}
