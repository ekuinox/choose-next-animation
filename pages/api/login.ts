import type { NextApiRequest, NextApiResponse } from 'next'
import { URLSearchParams } from 'url';

const createRedirectUrl = (clientId: string, callbackUrl: string) => {
    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", callbackUrl);
    params.append("scope", "read");
    return `https://annict.com/oauth/authorize?${params.toString()}`;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<void>
) {
    res.redirect(createRedirectUrl(process.env.ANNICT_CLIENT_ID, process.env.ANNICT_REDIRECT_URL));
}
