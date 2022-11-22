/**
 * https://developers.annict.com/
 */

import * as z from 'zod';

/**
 * 視聴したいアニメを取得するクエリ
 */
const getWannaWatchWorksQuery = `
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

/**
 * graphqlでとれるアニメの構造
 */
const workType = z.object({
    annictId: z.number(),
    title: z.string(),
    image: z.object({
        recommendedImageUrl: z.string(),
    }),
});

/**
 * graphqlのレスポンス
 */
const wannaWatchWorksResponseType = z.object({
    data: z.object({
        viewer: z.object({
            username: z.string(),
            annictId: z.number(),
            wannaWatchCount: z.number(),
            works: z.object({ nodes: z.array(workType) }),
        }),
    }),
});

/**
 * POST /oauth/token のレスポンス
 */
const exchangeCodeResponseType = z.object({
    access_token: z.string(),
});

/**
 * /animation に与えるクエリ
 */
export const animationCallbackQueryType = z.object({
    title: z.string(),
    workId: z.string(),
    recommendedImageUrl: z.string(),
    userId: z.string(),
    username: z.string(),
    wannaWatchCount: z.string(),
});

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

/**
 * アクセス許可ページのURLを作成する
 * @param clientId
 * @param callbackUrl
 * @returns
 */
export const buildAuthUrl = (): string => {
    const params = new URLSearchParams();
    params.append("client_id", process.env.ANNICT_CLIENT_ID);
    params.append("response_type", "code");
    params.append("redirect_uri", process.env.ANNICT_REDIRECT_URL);
    params.append("scope", "read");
    return `https://annict.com/oauth/authorize?${params.toString()}`;
};

/**
 * コードをアクセストークンと交換する
 * @param code
 * @returns
 */
export const exchangeCode = async (code: string): Promise<string> => {
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
    const resp = await exchangeCodeResponseType.parseAsync(json);
    const { access_token: accessToken } = resp;
    return accessToken;
};

/**
 * graphqlのリクエストをかける
 * @param accessToken
 * @param query
 * @returns
 */
export const graphql = async (accessToken: string, query: string): Promise<unknown> => {
    const resp = await fetch('https://api.annict.com/graphql', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
    });
    return await resp.json();
};

/**
 * 視聴したい設定にしているアニメを取得する
 * @param accessToken
 * @returns
 */
export const getWannaWatchWorks = async (accessToken: string): Promise<WannaWatchResponse> => {
    const json = await graphql(accessToken, getWannaWatchWorksQuery);
    const resp = await wannaWatchWorksResponseType.parseAsync(json);
    const { username, annictId, wannaWatchCount, works: { nodes } } = resp.data.viewer;
    return { username, annictId, wannaWatchCount, works: nodes };
};

/**
 * 与えたアニメの配列から1つをランダムに選ぶ
 * @param works
 * @returns
 */
export const selectRandomWork = (works: readonly Work[]): Work => {
    return works[Math.floor((Math.random() * works.length))];
};
