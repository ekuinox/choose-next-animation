import type { NextApiRequest, NextApiResponse } from 'next'

const GET_WANNA_WATCH_WORKS_QUERY = `
{
    viewer {
        username
		annictId
		wannaWatchCount
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

interface WannaWatchResponse {
    username: string;
    annictId: number;
    wannaWatchCount: number;
    works: Work[];
}

const getWannaWatchWorks = async (accessToken: string): Promise<WannaWatchResponse> => {
    const json = await fetch('https://api.annict.com/graphql', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: GET_WANNA_WATCH_WORKS_QUERY })
    }).then((r) => r.json());
    console.log(json);
    const { username, annictId, wannaWatchCount, works: { nodes } } = json.data.viewer;
    return { username, annictId, wannaWatchCount, works: nodes };
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
    const { works, username, annictId: userId, wannaWatchCount } = await getWannaWatchWorks(token);
    const { title, annictId: workId, image: { recommendedImageUrl } } = works[Math.floor((Math.random() * works.length))];
    const params = new URLSearchParams({
        title,
        workId: workId.toString(),
        recommendedImageUrl,
        userId: userId.toString(),
        username,
        wannaWatchCount: wannaWatchCount.toString(),
    });
    res.redirect(`/animation?${params.toString()}`).send();
};

export default handler;
