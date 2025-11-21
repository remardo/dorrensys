import { convexClient } from './convexClient';

export async function requestEmailCode(email: string): Promise<string | null> {
  if (!convexClient) {
    console.warn('Convex URL не задан, работа офлайн');
    return null;
  }
  const res = await convexClient.mutation('auth:requestCode', { email });
  return (res as any)?.code ?? null;
}

export async function verifyEmailCode(email: string, code: string): Promise<string | null> {
  if (!convexClient) return null;
  const res = await convexClient.mutation('auth:verifyCode', { email, code });
  return (res as any)?.token ?? null;
}

export async function fetchUsers(token: string) {
  if (!convexClient || !token) return [];
  return (await convexClient.query('users:list', { token })) as any[];
}

export async function setUserRole(token: string, email: string, role: string) {
  if (!convexClient || !token) throw new Error('Нет токена или Convex клиента');
  return await convexClient.mutation('users:setRole', { token, email, role });
}
