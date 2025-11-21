import { ConvexHttpClient } from 'convex/browser';
import { NewsItem } from './types';

const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;

export const convexClient = convexUrl ? new ConvexHttpClient(convexUrl) : null;

export async function fetchNewsFromConvex(): Promise<NewsItem[] | null> {
  if (!convexClient) return null;
  try {
    const result = await convexClient.query('news:list', {});
    const sorted = Array.isArray(result)
      ? result.sort((a: any, b: any) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
      : [];
    return sorted as NewsItem[];
  } catch (err) {
    console.warn('Convex news:list failed', err);
    return null;
  }
}

export async function pushNewsToConvex(items: NewsItem[]) {
  if (!convexClient) return;
  try {
    await convexClient.mutation('news:upsertBulk', { items });
  } catch (err) {
    console.warn('Convex news:upsertBulk failed', err);
  }
}
