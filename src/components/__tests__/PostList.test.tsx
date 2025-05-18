import '@testing-library/jest-dom';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import { PostList } from '../PostList.tsx';
import * as api from '../../services/hackerNewsApi';

jest.mock('../../services/hackerNewsApi');

const mockValidPost = [
    {
        id: 1,
        by: "test post",
        title: "test story",
        url: "http://example.com/",
        score: 100,
        descendants: 10,
        time: Math.floor(Date.now() / 1000),
    }
];

(api.fetchPosts as jest.Mock).mockResolvedValue(mockValidPost);

describe("PostList", () => {
    it("should render posts correctly", async () => {
        render(<PostList />);

        expect(screen.getByText("loading")).toBeInTheDocument();

        const post = await screen.findByText("test story");
        expect(post).toBeInTheDocument();
    });

    it("can load more posts", async () => {
        render(<PostList />);
    
        await waitFor(() => screen.getByText("Test Post"));
    
        const button = screen.getByRole("button", { name: /load more/i });
        fireEvent.click(button);
    
        await waitFor(() => {
          // Second post renders (in this mock, it's the same again)
          expect(screen.getAllByText("Test Post").length).toBe(2);
        });
      });
})

