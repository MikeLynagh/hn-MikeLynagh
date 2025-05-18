import { renderHook, act } from "@testing-library/react";
import { usePosts } from "../usePosts";
import { fetchPosts } from "../../services/hackerNewsApi";
import { POSTS_PER_PAGE } from "../../types/constants";

jest.mock("../../services/hackerNewsApi");

const mockPosts = Array.from({ length: POSTS_PER_PAGE }, (_, i) => ({
  id: i,
  by: `user${i}`,
  title: `Post ${i}`,
  url: `http://example.com/${i}`,
  score: 100,
  descendants: 10,
  time: Math.floor(Date.now() / 1000),
}));

describe("usePosts hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches and returns posts", async () => {
    (fetchPosts as jest.Mock).mockResolvedValueOnce(mockPosts);

    const { result, rerender } = renderHook(() => usePosts("top"));

    await act(async () => {
      await Promise.resolve();
    });

    expect(fetchPosts).toHaveBeenCalledWith("top", 1);
    expect(result.current.posts).toHaveLength(POSTS_PER_PAGE);
    expect(result.current.loading).toBe(false);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it("loads more posts on loadMore", async () => {
    (fetchPosts as jest.Mock).mockResolvedValue(mockPosts);

    const { result } = renderHook(() => usePosts("top"));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.posts).toHaveLength(POSTS_PER_PAGE);

    await act(async () => {
      result.current.loadMore();
      await Promise.resolve();
    });

    expect(result.current.posts).toHaveLength(POSTS_PER_PAGE * 2);
  });

  it("handles errors correctly", async () => {
    (fetchPosts as jest.Mock).mockRejectedValueOnce(new Error("API failed"));

    const { result } = renderHook(() => usePosts("top"));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.error).toBe("API failed");
    expect(result.current.loading).toBe(false);
    expect(result.current.posts).toHaveLength(0);
  });
});
