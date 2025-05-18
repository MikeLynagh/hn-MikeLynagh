import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { PostList } from '../PostList';
import * as api from '../../services/hackerNewsApi';
import { POSTS_PER_PAGE } from '../../types/constants';

jest.mock('../../services/hackerNewsApi');

const mockPosts = Array.from({ length: POSTS_PER_PAGE }, (_, i) => ({
  id: i + 1,
  by: "test author",
  title: `test story ${i + 1}`,
  url: "http://example.com/",
  points: 100,
  descendants: 10,
  time: Math.floor(Date.now() / 1000),
}));

describe("PostList", () => {
  beforeEach(() => {
    (api.fetchPosts as jest.Mock).mockClear();
  });

  it("renders posts from API", async () => {
    (api.fetchPosts as jest.Mock).mockResolvedValueOnce(mockPosts);
    render(<PostList />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    const post = await screen.findByText("test story 1");
    expect(post).toBeInTheDocument();
  });

  it("shows error message on fetch failure", async () => {
    (api.fetchPosts as jest.Mock).mockRejectedValueOnce(new Error("API error"));
    render(<PostList />);
    const error = await screen.findByRole("alert");
    expect(error).toHaveTextContent("API error");
  });
});