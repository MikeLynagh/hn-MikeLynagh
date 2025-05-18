export const POSTS_PER_PAGE = 30;
export const BASE_URL = "https://hacker-news.firebaseio.com/v0";

export const ENDPOINTS = {
    TOP_STORIES: `${BASE_URL}/topstories.json`,
    NEW_STORIES: `${BASE_URL}/newstories.json`,
    STORY: (id: number) => `${BASE_URL}/item/${id}.json`,
} as const;

export type PostType = "top" | "new";
export const POST_TYPES: PostType[] = ["top", "new"];

export const HTTP_STATUS = {
    OK: 200,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
} as const;