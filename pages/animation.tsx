import * as z from "zod";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { animationCallbackQueryType } from "../lib/annict";


export default function Animation() {
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
            <div>
                <a href='/'>back</a>
            </div>
        )
    }

    const { username, recommendedImageUrl, workId, title, wannaWatchCount } = animation;

    return (
        <div>
            <a href={`https://annict.com/@${username}`}>{username}</a>さんが次に見るべきアニメは...
            <img src={recommendedImageUrl} />
            <a href={`https://annict.com/works/${workId}`}>{title}</a> (1/{wannaWatchCount})
            <a href='/'>Back</a>
        </div>
    );
}
