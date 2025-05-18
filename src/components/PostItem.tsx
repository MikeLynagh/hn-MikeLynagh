import type { Post } from "../types/post";

export const PostItem = ({ post }: { post: Post }) => {
    return (
        <div className="border p-4 rounded">
            <h2>{post.title}</h2>
            <p>By: {post.by}</p>
            {post.url && (
                <a href={post.url} target="_blank" rel="noopener noreferrer">
                    Read More
                </a>
            )}
        </div>
    );
};