import type { Post } from "../types/post";

export const PostItem = ({ post }: { post: Post }) => {
    return (
        <article className="group mb-6"
        aria-labelledby={`post-${post.id}-title`}>
            <a href={post.url} 
            target="_blank" 
            rel="noopener noreferrer" className="text-lg font-semibold leading-3 text-gray-100
            group-hover:text-yellow-600 focus:text-yellow-600"
            aria-label={`Read ${post.title} (opens in new tab)`}
            >
                {post.title}
            </a>
            <div className="text-sm font-normal text-gray-400"
            aria-live="polite"
            >
                <span>By {post.by}</span>
                <span className="text-gray-500"> • </span>
                <span>{post.points} points</span>
                <span className="text-gray-500"> • </span>
                <span>{post.descendants} comments</span>
                <span className="text-gray-500"> • </span>
                <span>{post.time} ago</span>
            </div>
            
        </article>
    );
};