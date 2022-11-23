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
 * ログインしているユーザのユーザ名を取得するクエリ
 */
const getLoginedUserQuery = `
{
    viewer {
        username
    }
}`

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
 * 視聴したいアニメのgraphqlレスポンス
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
 * ログインしているユーザのgraphqlレスポンス
 */
const loginedUserResponseType = z.object({
    data: z.object({
        viewer: z.object({
            username: z.string(),
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
 * / に与えるクエリ
 */
export const loginCallbackQueryType = z.object({
    accessToken: z.string(),
    username: z.string(),
});

/**
 * ランダムにアニメを1つ返すAPIのレスポンス
 */
export const getRandomWorkResponse = z.union([
    z.object({
        ok: z.literal(false),
    }),
    z.object({
        ok: z.literal(true),
        title: z.string(),
        workId: z.number(),
        recommendedImageUrl: z.string(),
        userId: z.number(),
        username: z.string(),
        wannaWatchCount: z.number(),
    }),
]);

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

const redirectUrl = () => {
    // 基本こっちを優先する
    if (process.env.ORIGIN != null) {
        return `${process.env.ORIGIN}/api/callback`;
    }
    // for preview
    if (process.env.VERCEL_URL != null) {
        return `https://${process.env.VERCEL_URL}/api/callback`;
    }
    throw "ORIGIN and VERCEL_URL are not provided";
};

/**
 * アクセス許可ページのURLを作成する
 * @returns
 */
export const buildAuthUrl = (): string => {
    const params = new URLSearchParams();
    params.append("client_id", process.env.ANNICT_CLIENT_ID);
    params.append("response_type", "code");
    params.append("redirect_uri", redirectUrl());
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
    form.append("redirect_uri", redirectUrl());
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
 * ログインしているユーザのユーザ名を取得する
 */
export const getLoginedUsername = async (accessToken: string): Promise<string> => {
    const json = await graphql(accessToken, getLoginedUserQuery);
    const resp = await loginedUserResponseType.parseAsync(json);
    const { username } = resp.data.viewer;
    return username;
};

/**
 * 与えたアニメの配列から1つをランダムに選ぶ
 * @param works
 * @returns
 */
export const selectRandomWork = (works: readonly Work[]): Work => {
    return works[Math.floor((Math.random() * works.length))];
};
