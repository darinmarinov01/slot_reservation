'use server'

// Internal imports
import { getErrors } from '@/actions/errors/getErrors'
import { ApiError } from '@/common/types/slots-types'
import { FirebaseErrorMessageWithId } from '@/common/types/firebase-errors'

// Next.js imports for API routes
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<FirebaseErrorMessageWithId[] | ApiError>) {
    const data: FirebaseErrorMessageWithId = req.body

    if (!data) {
        res.status(400).json({ message: "Missing or invalid data" })
        return
    }

    try {
        const result = await getErrors()

        // If slots are found, respond with the slots
        if (result) {
            res.status(200).json(result)
        } else {
            res.status(404).json([])
        }
    } catch (error) {
        const apiError: ApiError = { message: (error as Error).message }
        res.status(500).json(apiError)
    }
}
