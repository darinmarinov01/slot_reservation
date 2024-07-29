// Internal imports
import { deleteErrors } from '@/actions/errors/deleteErrors'
import { ApiError } from '@/common/types/slots-types'
import { FirebaseError } from '@/common/types/firebase-errors'

// Next.js imports for API routes
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<FirebaseError | ApiError | []>) {
    // Validate request method
    if (req.method !== 'DELETE') {
        res.setHeader('Allow', ['DELETE'])
        res.status(405).json({ message: `Method ${req.method} not allowed` })
        return
    }

    try {
        const result = await deleteErrors()

        if (Array.isArray(result) && result.length === 0) {
            res.status(200).json(result) // 200 OK for successful deletion with an empty array
        } else {
            res.status(500).json({ message: 'Unexpected result format' }) // 500 Internal Server Error for unexpected result
        }
    } catch (error) {
        const apiError: ApiError = { message: (error as Error).message }
        res.status(500).json(apiError) // 500 Internal Server Error for unexpected errors
    }
}
