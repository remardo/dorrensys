import { query, mutation } from './_generated/server';
import { v } from 'convex/values';
import { requireAdmin } from './auth';

export const list = query({
  args: { token: v.string() },
  handler: async ({ db }, { token }) => {
    await requireAdmin(db, token);
    return await db.query('users').order('asc').collect();
  },
});

export const setRole = mutation({
  args: { token: v.string(), email: v.string(), role: v.string() },
  handler: async ({ db }, { token, email, role }) => {
    await requireAdmin(db, token);
    const user = await db.query('users').withIndex('by_email', (q) => q.eq('email', email.toLowerCase())).first();
    if (!user) throw new Error('Пользователь не найден');
    await db.patch(user._id, { role });
    return { ok: true };
  },
});
