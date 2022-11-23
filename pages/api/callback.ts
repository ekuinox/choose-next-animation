import * as z from 'zod';
import type { NextApiRequest, NextApiResponse } from 'next'
import { encryptAccessToken } from '../../lib';
import { loginCallbackQueryType, exchangeCode, getLoginedUsername } from '../../lib/annict';

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
    const username = await getLoginedUsername(token);

    const resp: z.infer<typeof loginCallbackQueryType> = {
        accessToken: encryptAccessToken(token),
        username,
    };
    const params = new URLSearchParams(resp);
    res.redirect(`/?${params.toString()}`).send();

};

export default handler;
