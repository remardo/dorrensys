import { ConvexHttpClient } from 'convex/browser';
import { Course, DocumentItem, HomeConfig, NewsItem, Task, User } from './types';

const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;

export const convexClient = convexUrl ? new ConvexHttpClient(convexUrl) : null;

// Утилита: чистим служебные поля, которых нет в валидаторах Convex
function stripMeta<T>(value: any): T {
  if (Array.isArray(value)) {
    return value.map((v) => stripMeta(v)) as any;
  }
  if (value && typeof value === 'object') {
    const cleaned: any = {};
    for (const [k, v] of Object.entries(value)) {
      if (k === '_id' || k === '_creationTime' || k === 'author') continue;
      cleaned[k] = stripMeta(v);
    }
    return cleaned;
  }
  return value;
}

export async function fetchNewsFromConvex(): Promise<NewsItem[] | null> {
  if (!convexClient) return null;
  try {
    const result = await (convexClient as any).query('news:list', {});
    return (result as NewsItem[]) ?? [];
  } catch (e) {
    console.warn('Convex news:list failed', e);
    return null;
  }
}

export async function pushNewsToConvex(items: NewsItem[], token?: string | null) {
  if (!convexClient) return;
  const sanitized = stripMeta<NewsItem[]>(items);
  await (convexClient as any).mutation('news:upsertBulk', { items: sanitized, token });
}

export async function fetchDocsFromConvex(): Promise<DocumentItem[] | null> {
  if (!convexClient) return null;
  try {
    return (await (convexClient as any).query('docs:list', {})) as DocumentItem[];
  } catch (e) {
    console.warn('Convex docs:list failed', e);
    return null;
  }
}

export async function pushDocsToConvex(items: DocumentItem[], token?: string | null) {
  if (!convexClient) return;
  const sanitized = stripMeta<DocumentItem[]>(items);
  await (convexClient as any).mutation('docs:upsertBulk', { items: sanitized, token });
}

export async function fetchCoursesFromConvex(): Promise<Course[] | null> {
  if (!convexClient) return null;
  try {
    return (await (convexClient as any).query('courses:list', {})) as Course[];
  } catch (e) {
    console.warn('Convex courses:list failed', e);
    return null;
  }
}

export async function pushCoursesToConvex(items: Course[], token?: string | null) {
  if (!convexClient) return;
  const normalized = items.map((c) => ({
    ...c,
    progress: Number.isFinite(c.progress as number) ? Number(c.progress) : 0,
    totalModules: Number.isFinite(c.totalModules as number) ? Number(c.totalModules) : c.modules?.length ?? 0,
    thumbnail: c.thumbnail || 'https://placehold.co/600x400',
    modules: c.modules?.map((m: any) => ({
      ...stripMeta(m),
      id: String(m.id),
      title: m.title || 'Без названия',
      type: m.type || 'article',
      duration: m.duration || '5 мин',
      sections: m.sections ?? [],
      content: m.content ?? '',
    })),
  }));
  const sanitized = stripMeta<Course[]>(normalized);
  await (convexClient as any).mutation('courses:upsertBulk', { items: sanitized, token });
}

export async function fetchTasksFromConvex(): Promise<Task[] | null> {
  if (!convexClient) return null;
  try {
    const result = await (convexClient as any).query('tasks:list', {});
    return (result as Task[]) ?? [];
  } catch (e) {
    console.warn('Convex tasks:list failed', e);
    return null;
  }
}

export async function pushTasksToConvex(items: Task[], token?: string | null) {
  if (!convexClient) return;
  const normalized = items.map((t) => ({
    id: String(t.id),
    title: t.title,
    description: t.description ?? '',
    status: t.status,
    priority: t.priority,
    assigneeEmail: t.assigneeEmail ?? t.assignee?.email ?? '',
    assigneeName: t.assigneeName ?? t.assignee?.name ?? '',
    assigneeAvatar: t.assigneeAvatar ?? t.assignee?.avatar ?? '',
    createdAt: t.createdAt ? new Date(t.createdAt).getTime() : Date.now(),
  }));
  const sanitized = stripMeta<Task[]>(normalized);
  await (convexClient as any).mutation('tasks:upsertBulk', { token, items: sanitized });
}

export async function fetchHomeFromConvex(): Promise<HomeConfig | null> {
  if (!convexClient) return null;
  try {
    return (await (convexClient as any).query('home:get', {})) as HomeConfig;
  } catch (e) {
    console.warn('Convex home:get failed', e);
    return null;
  }
}

export async function pushHomeToConvex(config: HomeConfig, token?: string | null) {
  if (!convexClient) return;
  const sanitized = stripMeta<HomeConfig>(config);
  await (convexClient as any).mutation('home:upsert', { token, config: sanitized });
}

export async function fetchUsersFromConvex(): Promise<User[] | null> {
  if (!convexClient) return null;
  try {
    return (await (convexClient as any).query('users:getUsers', {})) as User[];
  } catch (e) {
    console.warn('Convex users:getUsers failed', e);
    return null;
  }
}

export async function pushUsersToConvex(users: User[], token?: string | null) {
  if (!convexClient) return;
  const sanitized = stripMeta<User[]>(
    users.map((u) => ({
      email: u.email ?? '',
      name: u.name,
      role: u.role ?? 'employee',
      avatar: u.avatar || 'https://placehold.co/100',
      coins: Number.isFinite(u.coins) ? u.coins : 0,
      learningProgress: (u as any).learningProgress ?? [],
      tasks: (u as any).tasks ?? [],
    })),
  );
  await (convexClient as any).mutation('users:upsertBulk', { users: sanitized, token });
}

export async function requestAuthCode(email: string): Promise<string | null> {
  if (!convexClient) return null;
  const result = await (convexClient as any).mutation('auth:requestCode', { email });
  return (result as any)?.code ?? null;
}

export async function verifyAuthCode(email: string, code: string): Promise<{ token: string; email: string } | null> {
  if (!convexClient) return null;
  const result = (await (convexClient as any).mutation('auth:verifyCode', { email, code })) as { token: string; email: string } | null;
  return result;
}

export async function updateUserRole(email: string, role: string, token?: string | null) {
  if (!convexClient || !token) throw new Error('Нет токена');
  return (convexClient as any).mutation('users:updateUserRole', { token, email, role });
}
