import { renderHook, act } from "@testing-library/react";
import { usePosts } from "../usePosts";
import { fetchPosts } from "../../services/hackerNewsApi";
import { POSTS_PER_PAGE } from "../../types/constants";

jest.mock("../../services/hackerNewsApi");

const mockPosts = Array.from({ length: POSTS_PER_PAGE }, (_, i) => ({
  id: i + 1,
  by: "test author",
  title: `test story ${i + 1}`,
  url: "http://example.com/",
  points: 100,
  descendants: 10,
  time: Math.floor(Date.now() / 1000),
}));

describe("usePosts hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches and returns posts", async () => {
    (fetchPosts as jest.Mock).mockResolvedValueOnce(mockPosts);

    const { result } = renderHook(() => usePosts("top"));

    await act(async () => {
      await Promise.resolve();
    });

    expect(fetchPosts).toHaveBeenCalledWith("top", 1);
    expect(result.current.posts).toHaveLength(POSTS_PER_PAGE);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("handles fetch error", async () => {
    (fetchPosts as jest.Mock).mockRejectedValueOnce(new Error("API error"));

    const { result } = renderHook(() => usePosts("top"));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.error).toBe("API error");
    expect(result.current.posts).toHaveLength(0);
  });
});