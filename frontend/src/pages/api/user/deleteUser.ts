'use server'

// Internal imports
import { deleteUser } from '@/actions/user/deleteUser'
import { ApiError } from '@/common/types/slots-types'
import { User } from '@/common/types/user-types'

// Next.js imports for API routes
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<User | ApiError | null>) {
    const data: User | null = req.body;

    if (!data || !data.id) {
        res.status(400).json({ message: "Missing or invalid data" });
        return;
    }

    try {
        const result = await deleteUser(data);

        if ('message' in result) {
            res.status(409).json(result);
        } else {
            res.status(200).json(result); // 200 OK is more appropriate than 201 Created for a DELETE operation
        }
    } catch (error) {
        const apiError: ApiError = { message: (error as Error).message };
        res.status(500).json(apiError);
    }
}