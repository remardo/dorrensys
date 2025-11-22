import { ConvexHttpClient } from 'convex/browser';
import { Course, DocumentItem, HomeConfig, NewsItem, Task, User } from './types';

const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;

export const convexClient = convexUrl ? new ConvexHttpClient(convexUrl) : null;

export async function fetchNewsFromConvex(): Promise<NewsItem[] | null> {
  if (!convexClient) return null;
  try {
    const result = await convexClient.query('news:list', {});
    return (result as NewsItem[]) ?? [];
  } catch (e) {
    console.warn('Convex news:list failed', e);
    return null;
  }
}

export async function pushNewsToConvex(items: NewsItem[], token?: string | null) {
  if (!convexClient || !token) return;
  await convexClient.mutation('news:upsertBulk', { items, token });
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

export async function fetchTasksFromConvex(): Promise<Task[] | null> {
  if (!convexClient) return null;
  try {
    return (await convexClient.query('tasks:list', {})) as Task[];
  } catch (e) {
    console.warn('Convex tasks:list failed', e);
    return null;
  }
}

export async function pushTasksToConvex(items: Task[], token?: string | null) {
  if (!convexClient || !token) return;
  await convexClient.mutation('tasks:upsertBulk', { token, items });
}

export async function fetchHomeFromConvex(): Promise<HomeConfig | null> {
  if (!convexClient) return null;
  try {
    return (await convexClient.query('home:get', {})) as HomeConfig;
  } catch (e) {
    console.warn('Convex home:get failed', e);
    return null;
  }
}

export async function pushHomeToConvex(config: HomeConfig, token?: string | null) {
  if (!convexClient || !token) return;
  await convexClient.mutation('home:upsert', { token, config });
}

export async function fetchUsersFromConvex(): Promise<User[] | null> {
  if (!convexClient) return null;
  try {
    return (await convexClient.query('users:getUsers', {})) as User[];
  } catch (e) {
    console.warn('Convex users:getUsers failed', e);
    return null;
  }
}

export async function requestAuthCode(email: string): Promise<string | null> {
  if (!convexClient) return null;
  const result = await convexClient.mutation('auth:requestCode', { email });
  return (result as any)?.code ?? null;
}

export async function verifyAuthCode(email: string, code: string): Promise<{ token: string; email: string } | null> {
  if (!convexClient) return null;
  const result = (await convexClient.mutation('auth:verifyCode', { email, code })) as { token: string; email: string } | null;
  return result;
}
