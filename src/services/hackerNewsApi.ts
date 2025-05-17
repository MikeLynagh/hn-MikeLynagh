import type { Post } from "../types/post";

export const fetchPosts = async (type: "top" | "new"): Promise<Post[]> => {
    console.log("fetching posts");

    try {
        const response = await fetch(`https://hacker-news.firebaseio.com/v0/${type}stories.json`);
        console.log("response status:", response.status);

        if (!response.ok) {
            throw new Error(`HTTP error. status: ${response.status}`);
        }

        const postIds = await response.json();
        console.log("fetch post ids:", postIds);

        // fetch details for each post 
        const posts = await Promise.all(
            postIds.slice(0, 10).map(async (id: number) => {
                try {
                    const postResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);

                    if(!postResponse.ok) {
                        throw new Error(`HTTP error! status: ${postResponse.status}`);
                    }
                    const postData = await postResponse.json();

                    return {
                        by: postData.by,
                        title: postData.title, 
                        type: postData.type,
                        url: postData.url,
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
        return [];
    }
}

