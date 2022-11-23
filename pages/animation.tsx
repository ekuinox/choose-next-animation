import * as z from "zod";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { animationCallbackQueryType, getRandomWorkResponse } from "../lib/annict";

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

export const Animation: React.FC = () => {
    const { query } = useRouter();
    const token = useMemo(() => {
        const animation = animationCallbackQueryType.safeParse(query);
        if (!animation.success) {
            return null;
        }
        return animation.data.accessToken;
    }, [query]);
    const [animation, setAnimation] = useState<z.infer<typeof getRandomWorkResponse> & { ok: true } | null>(null);
    useEffect(() => {
        if (token == null) {
            return;
        }
        getAnimation(token).then((animation) => setAnimation(animation));
    }, [token]);

    if (animation == null) {
        return (
            <>
                <Head>
                    <title>choose-next-animation | animation</title>
                </Head>
                <main>
                    <div style={{
                        textAlign: 'center'
                    }}>
                        <Link href='/'>top</Link>
                    </div>
                </main>
            </>
        );
    }

    const { username, recommendedImageUrl, workId, title, wannaWatchCount } = animation;

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
                            <Image src={recommendedImageUrl} alt={title} />
                            <br />
                        </>
                    )}
                    <Link href={`https://annict.com/@${username}`}>{username}</Link>が次に見るべきアニメは...
                    <br />
                    <Link href={`https://annict.com/works/${workId}`}>{title}</Link> (1/{wannaWatchCount})
                    <br />
                    <Link href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${username}は${title}を見たほうが良い`)}&url=${encodeURIComponent(window.location.origin)}`}>Tweetする</Link>
                    <br />
                    <Link href='/'>top</Link>
                </div>
            </main>
        </>
    );
};

export default Animation;
