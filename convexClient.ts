import { ConvexHttpClient } from 'convex/browser';
import { Course, DocumentItem, NewsItem } from './types';

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

export async function pushNewsToConvex(items: NewsItem[], token?: string | null) {
  if (!convexClient || !token) {
    if (!token) console.warn('Нет токена Convex, сохраняю только локально');
    return;
  }
  try {
    await convexClient.mutation('news:upsertBulk', { items, token });
  } catch (err) {
    console.warn('Convex news:upsertBulk failed', err);
  }
}

export async function fetchDocsFromConvex(): Promise<DocumentItem[] | null> {
  if (!convexClient) return null;
  try {
    return (await convexClient.query('docs:list', {})) as DocumentItem[];
  } catch (e) {
    console.warn('Convex docs:list failed', e);
    return null;
  }
}

export async function pushDocsToConvex(items: DocumentItem[], token?: string | null) {
  if (!convexClient || !token) return;
  await convexClient.mutation('docs:upsertBulk', { items, token });
}

export async function fetchCoursesFromConvex(): Promise<Course[] | null> {
  if (!convexClient) return null;
  try {
    return (await convexClient.query('courses:list', {})) as Course[];
  } catch (e) {
    console.warn('Convex courses:list failed', e);
    return null;
  }
}

export async function pushCoursesToConvex(items: Course[], token?: string | null) {
  if (!convexClient || !token) return;
  await convexClient.mutation('courses:upsertBulk', { items, token });
}
