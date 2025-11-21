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
