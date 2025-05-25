import { fetchPosts, __TEST__clearPostCache } from '../hackerNewsApi';
import { ENDPOINTS } from '../../types/constants';
import * as delayModule from '../../utils/delay';

const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => { });

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
  globalThis.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
  __TEST__clearPostCache();

});

afterAll(() => {
  mockConsoleError.mockRestore();
});

describe('fetchPosts', () => {
  it('should fetch and transform posts correctly', async () => {
    (globalThis.fetch as jest.Mock)
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
        json: () => Promise.resolve({ ...mockValidPost, id: 2 })
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
    (globalThis.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(fetchPosts('top')).rejects.toThrow('Network error');
  });

  it("filters out null or undefined posts", async () => {
    (globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve([1, 2]) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve(mockValidPost) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve(null) });

    const result = await fetchPosts("top");
    expect(result.length).toBe(1);
    expect(result[0].title).toBe(mockValidPost.title);
  });

  it("returns cached data within TTL and avoids network calls", async () => {
    (globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve([1, 2]) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve(mockValidPost) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({ ...mockValidPost, id: 2 }) });

    const result1 = await fetchPosts("top");
    expect(globalThis.fetch).toHaveBeenCalledTimes(3);

    (globalThis.fetch as jest.Mock).mockClear();

    const result2 = await fetchPosts("top");
    expect(globalThis.fetch).not.toHaveBeenCalled();

    expect(result1).toEqual(result2);
  });


  it('fetches posts in batches and waits between batches', async () => {
    const batchSize = 10;
    const totalPosts = 25;
    const postIds = Array.from({ length: totalPosts }, (_, i) => i + 1);

    const delaySpy = jest.spyOn(delayModule, 'delay').mockResolvedValue(undefined);

    // Mock fetch: first call returns postIds, then each post returns mockValidPost
    (globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve(postIds) });
    for (let i = 0; i < totalPosts; i++) {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true, status: 200, json: () => Promise.resolve({ ...mockValidPost, id: postIds[i] })
      });
    }

    // Act
    await fetchPosts('top', 1);

    // Assert
    expect(globalThis.fetch).toHaveBeenCalledTimes(1 + totalPosts);

    expect(delaySpy).toHaveBeenCalledTimes(Math.ceil(totalPosts / batchSize) - 1);

    delaySpy.mockRestore();
  });
});