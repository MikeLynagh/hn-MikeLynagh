import { fetchPosts } from '../hackerNewsApi';
import { ENDPOINTS } from '../../types/constants';

const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

const mockValidPost = {
  by: 'testuser',
  title: 'Test Post',
  type: 'story',
  url: 'https://example.com',
  id: 1,
  points: 100,
  descendants: 5,
  time: Date.now() / 1000
};

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
  it('should fetch and transform posts correctly', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ 
        ok: true,
        status: 200,
        json: () => Promise.resolve([1, 2]) 
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockValidPost)
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({...mockValidPost, id: 2})
      });

    const result = await fetchPosts('top');
    
    expect(result).toEqual([
      expect.objectContaining({
        title: 'Test Post',
        url: 'https://example.com'
      }),
      expect.objectContaining({
        title: 'Test Post',
        url: 'https://example.com'
      })
    ]);
    expect(fetch).toHaveBeenCalledWith(ENDPOINTS.TOP_STORIES);
  });


  it('should throw an error on network failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
    
    await expect(fetchPosts('top')).rejects.toThrow('Network error');
  });

  it("filters out null or undefined posts", async () => {
    (global.fetch as jest.Mock)
    .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve([1,2])})
    .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve(mockValidPost)})
    .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve(null)});

    const result = await fetchPosts("top");
    expect(result.length).toBe(1);
    expect(result[0].title).toBe(mockValidPost.title);
  });

});