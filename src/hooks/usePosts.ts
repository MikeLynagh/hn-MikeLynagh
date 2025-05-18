import { useState, useEffect } from "react";
import { fetchPosts } from "../services/hackerNewsApi";
import type { Post } from "../types/post";

export const usePosts = (type: "top" | "new" = "top") => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const loadPosts = async () => {
            try {
                setLoading(true);
                setError(null);

                if (page === 1) {
                    setPosts([]);
                }

                const data = await fetchPosts(type, page);

                if (page === 1) {
                    setPosts(data);
                } else {
                    setPosts(prev => [...prev, ...data]);
                }
                setHasMore(data.length === 30);
            } catch (error) {
                setError(error instanceof Error ? error.message: "An error occurred")
            } finally {
                setLoading(false);
            }
        }
        loadPosts();
    }, [type, page]);

    const loadMore = () => {
        if (!loading && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    const resetPage = () => {
        setPage(1);
        setHasMore(true);
    }

    return {
        posts, 
        loading, 
        error,
        hasMore,
        loadMore,
        resetPage
    };
};