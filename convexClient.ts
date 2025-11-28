import { ConvexHttpClient } from 'convex/browser';
import { Course, DocumentItem, HomeConfig, NewsItem, Task, User } from './types';

const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;

export const convexClient = convexUrl ? new ConvexHttpClient(convexUrl) : null;

export async function uploadFileToConvex(file: File | Blob): Promise<{ url: string; storageId: string }> {
  if (!convexClient || !convexUrl) throw new Error('Нет подключения к Convex');
  const uploadUrl = await (convexClient as any).mutation('uploads:getUploadUrl', {});
  const res = await fetch(uploadUrl, {
    method: 'POST',
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
    body: file,
  });
  const json = await res.json();
  const storageId = json.storageId as string;
  const url = (await getStorageUrl(storageId)) ?? `${convexUrl}/api/storage/${storageId}`;
  return { url, storageId };
}

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

const storageUrlCache = new Map<string, Promise<string | null>>();

const isStorageId = (value?: string | null) => !!value && /^[a-z0-9]{20,}$/i.test(value);

export async function getStorageUrl(storageId: string): Promise<string | null> {
  if (!isStorageId(storageId) || !convexClient) return null;
  if (!storageUrlCache.has(storageId)) {
    const promise = (convexClient as any)
      .query('uploads:getFileUrl', { storageId })
      .catch((e: any) => {
        console.warn('Convex uploads:getFileUrl failed', e);
        return null;
      });
    storageUrlCache.set(storageId, promise);
  }
  return await storageUrlCache.get(storageId)!;
}

const storageIdFromLink = (link?: string | null) => {
  if (!link) return null;
  if (/^https?:\/\//i.test(link)) {
    try {
      const url = new URL(link);
      const parts = url.pathname.split('/').filter(Boolean);
      const idx = parts.findIndex((p) => p === 'storage');
      if (idx !== -1 && parts[idx + 1] && isStorageId(parts[idx + 1])) return parts[idx + 1];
    } catch {
      return null;
    }
    return null;
  }
  if (link.includes('/api/storage/')) {
    const candidate = link.split('/api/storage/')[1]?.split('?')[0] ?? null;
    return isStorageId(candidate) ? candidate : null;
  }
  if (isStorageId(link)) return link;
  return null;
};

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
  const normalized = items.map((n) => {
    const { createdAt: _createdAt, ...rest } = n;
    return rest;
  });
  const sanitized = stripMeta<NewsItem[]>(normalized);
  const payload: any = { items: sanitized };
  if (token ?? undefined) payload.token = token as string;
  await (convexClient as any).mutation('news:upsertBulk', payload);
}

export async function fetchDocsFromConvex(): Promise<DocumentItem[] | null> {
  if (!convexClient) return null;
  try {
    const docs = ((await (convexClient as any).query('docs:list', {})) as DocumentItem[]) ?? [];
    const resolved = await Promise.all(
      docs.map(async (doc) => {
        const storageId = storageIdFromLink(doc.link);
        if (!storageId) return doc;
        const url = await getStorageUrl(storageId);
        if (!url) return doc;
        return { ...doc, link: url };
      }),
    );
    return resolved;
  } catch (e) {
    console.warn('Convex docs:list failed', e);
    return null;
  }
}

export async function pushDocsToConvex(items: DocumentItem[], token?: string | null) {
  if (!convexClient) return;
  const normalized = items.map((d) => {
    const { createdAt: _createdAt, ...rest } = d as any;
    return rest;
  });
  const sanitized = stripMeta<DocumentItem[]>(normalized);
  const payload: any = { items: sanitized };
  if (token ?? undefined) payload.token = token as string;
  await (convexClient as any).mutation('docs:upsertBulk', payload);
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
  const normalized = items.map((c) => {
    const { createdAt: _createdAt, ...rest } = c;
    return {
      ...rest,
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
    };
  });
  const sanitized = stripMeta<Course[]>(normalized);
  const payload: any = { items: sanitized };
  if (token ?? undefined) payload.token = token as string;
  await (convexClient as any).mutation('courses:upsertBulk', payload);
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
  const payload: any = { items: sanitized };
  if (token ?? undefined) payload.token = token as string;
  await (convexClient as any).mutation('tasks:upsertBulk', payload);
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
  // createdAt is set server-side; strip it to satisfy validator
  const { createdAt: _createdAt, ...rest } = config as any;
  const sanitized = stripMeta<HomeConfig>(rest);
  const payload: any = { config: sanitized };
  if (token ?? undefined) payload.token = token as string;
  await (convexClient as any).mutation('home:upsert', payload);
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
      department: (u as any).department ?? 'mgmt',
      learningProgress: (u as any).learningProgress ?? [],
      tasks: (u as any).tasks ?? [],
    })),
  );
  const payload: any = { users: sanitized };
  if (token ?? undefined) payload.token = token as string;
  await (convexClient as any).mutation('users:upsertBulk', payload);
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
  if (!convexClient) throw new Error('Нет подключения к Convex');
  return (convexClient as any).mutation('users:updateUserRole', { token, email, role });
}

export async function deleteUserFromConvex(userId: string, token?: string | null) {
  if (!convexClient) throw new Error('Нет подключения к Convex');
  if (!token) throw new Error('Нужен токен для удаления пользователя');
  return (convexClient as any).mutation('users:deleteUser', { token, userId });
}


