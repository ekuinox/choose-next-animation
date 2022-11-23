import * as z from 'zod';
import type { NextApiRequest, NextApiResponse } from 'next'
import { decryptAccessToken } from '../../lib';
import { getRandomWorkResponse, getWannaWatchWorks, selectRandomWork } from '../../lib/annict';

export const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<z.infer<typeof getRandomWorkResponse>>,
) => {
    const token_ = req.headers.authorization;
    if (token_ == null) {
        res.status(500).json({ ok: false });
        return;
    }
    const token = decryptAccessToken(token_);
    const { works, username, annictId: userId, wannaWatchCount } = await getWannaWatchWorks(token);
    const { title, annictId: workId, image: { recommendedImageUrl } } = selectRandomWork(works);
    res.status(200).json({
        ok: true,
        title,
        workId,
        username,
        userId,
        wannaWatchCount,
        recommendedImageUrl,
    });
};

export default handler;
