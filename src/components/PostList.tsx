import { useState, useEffect } from "react";
import { PostItem } from "./PostItem";
import { Tabs } from "./Tabs";
import { usePosts } from "../hooks/usePosts";

export const PostList = () => {
    const [activeTab, setActiveTab] = useState<"top" | "new">("top");
    const { posts, loading, error, hasMore, loadMore, resetPage } = usePosts(activeTab);

    useEffect(() => {
        resetPage();
    }, [activeTab, resetPage]);

    return(
        <div className="max-w-2xl mx-auto p-4">
            <Tabs activeTab={activeTab} onChange={setActiveTab} />

            {error && (
                <div className="bg-red-500 text-white p-4 mb-4 rounded">
                    {error}
                </div>
            )}

            {loading && posts.length === 0? (
                <p>Loading...</p>
            ): (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <PostItem key={post.id} post={post} />
                    ))}
                    {
                        hasMore && (
                            <button
                            onClick={loadMore}
                            disabled={loading}
                            className=" bg-gray-800 text-white hover:text-yellow-600 p-4 rounded shadow hover:bg-gray-700 disabled:opacity-50"
                        >
                            {loading ? "Loading..." : "Load More"}
                        </button>
                        )
                    }
                </div>
            )}
        </div>
    );
};