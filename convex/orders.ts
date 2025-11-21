import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { requireAdmin } from './auth';

export const list = query({
  args: {},
  handler: async ({ db }) => db.query('orders').order('desc').collect(),
});

export const upsertBulk = mutation({
  args: {
    token: v.string(),
    items: v.array(
      v.object({
        title: v.string(),
        type: v.string(),
        size: v.string(),
      }),
    ),
  },
  handler: async ({ db }, { token, items }) => {
    await requireAdmin(db, token);
    for (const o of items) {
      await db.insert('orders', { ...o, createdAt: Date.now() });
    }
    return { ok: true, count: items.length };
  },
});
