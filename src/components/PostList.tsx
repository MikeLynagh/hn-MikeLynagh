import { useState, useEffect } from "react";
import { fetchPosts } from "../services/hackerNewsApi";
import { PostItem } from "./PostItem";
import { Tabs } from "./Tabs";
import type { Post } from "../types/post";

export const PostList = () => {
    const [activeTab, setActiveTab] = useState<"top" | "new">("top");
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true);
            const data = await fetchPosts(activeTab);
            setPosts(data);
            setLoading(false);
        };
        loadPosts();
    }, [activeTab]);

    return(
        <div className="max-w-2xl mx-auto p-4">
            
            <Tabs activeTab={activeTab} onChange={setActiveTab} />
            {loading ? (
                <p>Loading...</p>
            ): (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <PostItem key={post.id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
};