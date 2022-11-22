import * as z from "zod";
import Head from "next/head";
import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/router";
import { animationCallbackQueryType } from "../lib/annict";

export const Animation: React.FC = () => {
    const { query } = useRouter();
    const animation: z.infer<typeof animationCallbackQueryType> | null = useMemo(() => {
        const animation = animationCallbackQueryType.safeParse(query);
        if (animation.success) {
            return animation.data;
        }
        return null;
    }, [query]);

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
        )
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
                            <img src={recommendedImageUrl} />
                            <br />
                        </>
                    )}
                    <Link href={`https://annict.com/@${username}`}>{username}</Link>が次に見るべきアニメは...
                    <br />
                    <Link href={`https://annict.com/works/${workId}`}>{title}</Link> (1/{wannaWatchCount})
                    <br />
                    <Link href='/'>top</Link>
                </div>
            </main>
        </>
    );
};

export default Animation;
