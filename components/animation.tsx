import * as z from "zod";
import useSWR from "swr";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
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

const buildIntentTweetUrl = (username: string, title: string) => {
    const params = new URLSearchParams({
        text: `${username}は${title}を見たほうが良い`,
        url: window.location.origin,
    });
    return `https://twitter.com/intent/tweet?${params.toString()}`;
};

export const Animation = ({ username, recommendedImageUrl, workId, title }: AnimationProps) => {
    const intentTweetUrl = useMemo(() => buildIntentTweetUrl(username, title), [username, title]);
    return (
        <Box>
            <Typography variant="h6">
                次に見るアニメはこれ！
            </Typography>
            {recommendedImageUrl.length > 0 && (
                <Box>
                    <img src={recommendedImageUrl} alt={title} />
                </Box>
            ) || (
                    <Typography variant="h4">
                        {title}
                    </Typography>
                )}
            <Typography>
                <Link href={`https://annict.com/works/${workId}`}>anime(annict)</Link>
                {" | "}
                <Link href={`https://annict.com/${username}/wanna_watch`}>{username}(annict)</Link>
                {" | "}
                <Link href={intentTweetUrl}>
                    ツイートする
                </Link>
            </Typography>
        </Box>
    );
};

const AnimationWithToken = ({ token }: { token: string }) => {
    const fetcher = useCallback(async () => {
        return await getAnimation(token);
    }, [token]);
    const { data: animation, error } = useSWR('/api/animation', fetcher);

    if (error != null || animation == null) {
        return (
            <Typography>
                たぶんロード中...
            </Typography>
        );
    }

    return (
        <Animation {...animation} />
    );
};

export const AnimationWithNullableToken = ({ token }: { token: string | null }) => {
    if (token == null) {
        return (
            <Typography variant="h5">
                <Link href='/api/login'>
                    Annictでログイン
                </Link>
            </Typography>
        );
    }
    return <AnimationWithToken token={token} />
};
