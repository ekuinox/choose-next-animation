import { useRouter } from "next/router";

export default function Animation() {
    const { query } = useRouter();
    const { title, workId, recommendedImageUrl, username, wannaWatchCount } = query;
    if (typeof title !== 'string' || typeof workId !== 'string' || typeof recommendedImageUrl !== 'string' || typeof username !== 'string' || typeof wannaWatchCount !== 'string') {
        return (
            <>だめ～</>
        );
    }
    return (
        <div>
            <a href={`https://annict.com/@${username}`}>{username}</a>さんが次に見るべきアニメは...
            <img src={recommendedImageUrl} />
            <a href={`https://annict.com/works/${workId}`}>{title}</a> (1/{wannaWatchCount})
            <a href='/'>Back</a>
        </div>
    );
}
