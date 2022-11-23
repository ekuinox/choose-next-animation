import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import useSWR from "swr";
import { z } from "zod";
import { getRandomWorkResponse } from "../lib/annict";

interface AnimationProps {
    username: string;
    recommendedImageUrl: string;
    workId: number;
    title: string;
    wannaWatchCount: number;
}

const getAnimation = async (token: string): Promise<z.infer<typeof getRandomWorkResponse> & { ok: true } | null> => {
    try {
        const resp = await fetch('/api/random', { headers: { authorization: token } });
        const json = await resp.json();
        const work = await getRandomWorkResponse.parseAsync(json);
        if (work.ok) {
            return work;
        }
        return null;
    } catch (e: unknown) {
        return null;
    }
};

export const Animation = ({ username, recommendedImageUrl, workId, title, wannaWatchCount }: AnimationProps) => {
    return (
        <>
            <Head>
                <title>{username}は{title}を見たほうが良い</title>
            </Head>
            <main>
                <div style={{
                    textAlign: 'center'
                }}>
                    {recommendedImageUrl.length > 0 && (
                        <>
                            <img src={recommendedImageUrl} alt={title} />
                            <br />
                        </>
                    )}
                    <Link href={`https://annict.com/@${username}`}>{username}</Link>が次に見るべきアニメは...
                    <br />
                    <Link href={`https://annict.com/works/${workId}`}>{title}</Link> (1/{wannaWatchCount})
                    <br />
                    <Link href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${username}は${title}を見たほうが良い`)}&url=${encodeURIComponent(window.location.origin)}`}>Tweetする</Link>
                </div>
            </main>
        </>
    );
};

const AnimationWithToken = ({ token }: { token: string }) => {
    const fetcher = useCallback(async () => {
        return await getAnimation(token);
    }, [token]);
    const { data: animation, error } = useSWR('/api/animation', fetcher);

    if (error != null || animation == null) {
        return (
            <>
                <p>たぶんロード中...</p>
            </>
        );
    }

    return <Animation {...animation} />
}

export const AnimationWithNullableToken = ({ token }: { token: string | null }) => {
    if (token == null) {
        return (
            <p><Link href='/api/login'>ログイン</Link>してアニメを選ぶ
            </p>
        );
    }
    return <AnimationWithToken token={token} />
};
