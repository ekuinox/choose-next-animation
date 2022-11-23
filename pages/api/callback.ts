import * as z from 'zod';
import type { NextApiRequest, NextApiResponse } from 'next'
import { encryptAccessToken } from '../../lib';
import { animationCallbackQueryType, exchangeCode } from '../../lib/annict';

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

    const resp: z.infer<typeof animationCallbackQueryType> = {
        accessToken: encryptAccessToken(token),
    };
    const params = new URLSearchParams(resp);
    res.redirect(`/animation?${params.toString()}`).send();

};

export default handler;
