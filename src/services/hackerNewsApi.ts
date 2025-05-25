import type { Post } from "../types/post";
import { ENDPOINTS, POSTS_PER_PAGE, HTTP_STATUS } from "../types/constants";
import { createBatches } from "../utils/createBatches";
import { delay } from "../utils/delay";

const CACHE_TTL_MS = 1000 * 60 * 5;

type CacheEntry = {
    data: Post[];
    timestamp: number;
};

const postCache = new Map<string, CacheEntry>();

// for testing purpose only 
export const __TEST__clearPostCache = () => {
    postCache.clear();
};

const RATE_LIMIT = {
    REQUESTS_PER_SECOND: 20,
    BATCH_SIZE: 10,
    DELAY_MS: 100,
};


export const fetchPosts = async (
    type: "top" | "new",
    page: number = 1,
): Promise<Post[]> => {
    const cacheKey = `${type}-${page}`;
    const now = Date.now();

    const cached = postCache.get(cacheKey);
    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
        return cached.data;
    }

    try {
        const endpoint = type === "top" ? ENDPOINTS.TOP_STORIES : ENDPOINTS.NEW_STORIES;
        const response = await fetch(endpoint);

        if (response.status !== HTTP_STATUS.OK) {
            throw new Error(`HTTP error. status: ${response.status}`);
        }

        const postIds = await response.json();
        const startIndex = (page - 1) * POSTS_PER_PAGE;
        const endIndex = startIndex + POSTS_PER_PAGE;
        const paginatedIds = postIds.slice(startIndex, endIndex);

        const batches = createBatches(paginatedIds, RATE_LIMIT.BATCH_SIZE);

        const allPosts: Post[] = [];
        for (const [i, batch] of batches.entries()) {
            const batchPosts = await Promise.all(
                (batch as number[]).map(async (id: number) => {
                    try {
                        const postResponse = await fetch(ENDPOINTS.STORY(id));
                        if (!postResponse.ok) {
                            throw new Error(`HTTP error! status: ${postResponse.status}`);
                        }
                        const postData = await postResponse.json();

                        return {
                            id: postData.id,
                            by: postData.by,
                            title: postData.title,
                            type: postData.type,
                            url: postData.url,
                            points: postData.score,
                            time: postData.time,
                            descendants: postData.descendants,
                        } as Post;
                    } catch (error) {
                        console.error(`Error fetching post ${id}:`, error);
                        return null;
                    }
                })
            );
            allPosts.push(...batchPosts.filter((post): post is Post => post !== null));

            if ( i !== batches.length - 1) {
                await delay(RATE_LIMIT.DELAY_MS);
            }
        }
        postCache.set(cacheKey, { data: allPosts, timestamp: now });
        return allPosts;
    } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
    }
}

