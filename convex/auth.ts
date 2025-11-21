import { mutation } from './_generated/server';
import { v } from 'convex/values';

const CODE_TTL_MS = 10 * 60 * 1000; // 10 минут
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 часа

function generateCode() {
  return String(100000 + Math.floor(Math.random() * 900000));
}

function generateToken() {
  const random = crypto.getRandomValues(new Uint32Array(4));
  return Array.from(random, (n) => n.toString(16)).join('');
}

export const requestCode = mutation({
  args: { email: v.string() },
  handler: async ({ db }, { email }) => {
    const code = generateCode();
    await db.insert('authCodes', { email: email.toLowerCase(), code, createdAt: Date.now() });
    // В бою нужно отправлять email; здесь возвращаем код для dev.
    return { code };
  },
});

export const verifyCode = mutation({
  args: { email: v.string(), code: v.string() },
  handler: async ({ db }, { email, code }) => {
    const now = Date.now();
    const latest = await db.query('authCodes').withIndex('by_email', (q) => q.eq('email', email.toLowerCase())).order('desc').first();
    if (!latest) throw new Error('Код не найден, запросите новый');
    if (latest.code !== code) throw new Error('Неверный код');
    if (now - latest.createdAt > CODE_TTL_MS) throw new Error('Код устарел, запросите новый');

    const token = generateToken();
    await db.insert('sessions', { email: email.toLowerCase(), token, createdAt: now });
    return { token, email: email.toLowerCase() };
  },
});

export async function requireSession(db: any, token: string) {
  if (!token) throw new Error('Нет токена');
  const session = await db.query('sessions').withIndex('by_token', (q: any) => q.eq('token', token)).first();
  if (!session) throw new Error('Сессия не найдена');
  if (Date.now() - session.createdAt > SESSION_TTL_MS) throw new Error('Сессия устарела, войдите снова');
  return session;
}
