import { fetchPosts } from '../hackerNewsApi';
// import type { Post } from '../../types/post';

const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  mockConsoleError.mockRestore();
});

describe('fetchPosts', () => {
  const mockValidPost = {
    by: 'testuser',
    title: 'Test Post',
    type: 'story',
    url: 'https://example.com',
    id: 1,
    score: 100,
    descendants: 5,
    time: Date.now() / 1000
  };

  it('returns posts with only by, title, type, and url fields', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ 
        ok: true,
        json: () => Promise.resolve([1])
      })
      .mockResolvedValueOnce({ 
        ok: true,
        json: () => Promise.resolve(mockValidPost)
      });

    const result = await fetchPosts('top');
    
    expect(result).toEqual([{
      by: mockValidPost.by,
      title: mockValidPost.title,
      type: mockValidPost.type,
      url: mockValidPost.url
    }]);
  });

  it("returns empty array on network failure", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    const result = await fetchPosts("top");
    expect(result).toEqual([]);
    expect(console.error).toHaveBeenCalled();
  });

  it("returns empty array when no posts are found", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
        ok: true, 
        json: () => Promise.resolve([])
    });

    const result = await fetchPosts("top");
    expect(result).toEqual([]);
  });

  it("filters out null or undefined posts", async () => {
    (global.fetch as jest.Mock)
    .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([1,2])})
    .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockValidPost)})
    .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(null)});

    const result = await fetchPosts("top");
    expect(result.length).toBe(1);
    expect(result[0].title).toBe(mockValidPost.title);
  })
});