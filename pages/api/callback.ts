import type { NextApiRequest, NextApiResponse } from 'next'

const GET_WANNA_WATCH_WORKS_QUERY = `
{
    viewer {
        works (state: WANNA_WATCH) {
            nodes {
                annictId
                title
                image {
                    recommendedImageUrl
                }
            }
        }
    }
}`;

interface Work {
    annictId: number;
    title: string;
    image: {
        recommendedImageUrl: string;
    };
}

const getWannaWatchWorks = async (accessToken: string): Promise<Work[]> => {
    const json = await fetch('https://api.annict.com/graphql', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: GET_WANNA_WATCH_WORKS_QUERY })
    }).then((r) => r.json());
    console.log(json);
    return json.data.viewer.works.nodes;
};

const getAccessToken = async (code: string) => {
    const form = new FormData();
    form.append("client_id", process.env.ANNICT_CLIENT_ID);
    form.append("client_secret", process.env.ANNICT_CLIENT_SECRET);
    form.append("grant_type", "authorization_code");
    form.append("redirect_uri", process.env.ANNICT_REDIRECT_URL);
    form.append("code", code);
    const json = await fetch('https://annict.com/oauth/token', {
        method: 'POST',
        body: form,
    }).then((r) => r.json());
    console.log({ json });
    const { access_token: accessToken } = json;
    return accessToken;
};

export const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<void>
) => {
    const { code } = req.query;
    console.log({ code });
    if (typeof code !== 'string' || code.length < 1) {
        res.status(500).send();
        return;
    }
    const token = await getAccessToken(code);
    const works = await getWannaWatchWorks(token);
    console.log({ works });
    console.log({ works: works.length });
    res.redirect('/').send();
};

export default handler;
