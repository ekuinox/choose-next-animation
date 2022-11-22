import * as z from 'zod';
import type { NextApiRequest, NextApiResponse } from 'next'
import { animationCallbackQueryType, exchangeCode, getWannaWatchWorks, selectRandomWork } from '../../lib/annict';

export const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<void>
) => {
    const { code } = req.query;
    if (typeof code !== 'string' || code.length < 1) {
        res.status(500).send();
        return;
    }
    const token = await exchangeCode(code);
    const { works, username, annictId: userId, wannaWatchCount } = await getWannaWatchWorks(token);
    const { title, annictId: workId, image: { recommendedImageUrl } } = selectRandomWork(works);
    const resp: z.infer<typeof animationCallbackQueryType> = {
        title,
        workId: workId.toString(),
        recommendedImageUrl,
        userId: userId.toString(),
        username,
        wannaWatchCount: wannaWatchCount.toString(),
    };
    const params = new URLSearchParams(resp);
    res.redirect(`/animation?${params.toString()}`).send();
};

export default handler;
