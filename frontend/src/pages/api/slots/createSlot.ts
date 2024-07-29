'use server';

// Internal imports
import { createSlot } from '@/actions/slots/createSlot';
import { ApiError, SlotProperties } from '@/common/types/slots-types';

// Next.js imports for API routes
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<SlotProperties | ApiError>) {
    const data: SlotProperties = req.body;
    const { location }: { location: string } = req.body

    if (!location && !data) {
        res.status(400).json({ message: "Missing or invalid data" });
        return;
    }

    try {
        const result = await createSlot(data);

        if ('message' in result) {
            res.status(409).json(result);
        } else {
            res.status(200).json(result); // 200 OK is more appropriate than 201 Created for a PUT operation
        }
    } catch (error) {
        const apiError: ApiError = { message: (error as Error).message };
        res.status(500).json(apiError);
    }
}
