import type { Post } from "../types/post";
import { ENDPOINTS, POSTS_PER_PAGE, HTTP_STATUS } from "../types/constants";

export const fetchPosts = async (
    type: "top" | "new",
    page: number = 1,
): Promise<Post[]> => {

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

        const posts = await Promise.all(
            paginatedIds.map(async (id: number) => {
                try {
                    const postResponse = await fetch(ENDPOINTS.STORY(id));
                    if(!postResponse.ok) {
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

        return posts.filter((post): post is Post => post !== null);
    } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
    }
}

