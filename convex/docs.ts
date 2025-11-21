import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { requireAdmin } from './auth';

export const list = query({
  args: {},
  handler: async ({ db }) => db.query('docs').order('desc').collect(),
});

export const upsertBulk = mutation({
  args: {
    token: v.string(),
    items: v.array(
      v.object({
        id: v.number(),
        title: v.string(),
        type: v.string(),
        size: v.string(),
        category: v.string(),
        updated: v.string(),
        link: v.string(),
      }),
    ),
  },
  handler: async ({ db }, { token, items }) => {
    await requireAdmin(db, token);
    for (const item of items) {
      const existing = await db.query('docs').withIndex('by_id', (q) => q.eq('id', item.id)).first();
      if (existing?._id) {
        await db.patch(existing._id, { ...item });
      } else {
        await db.insert('docs', { ...item, createdAt: Date.now() });
      }
    }
    return { ok: true, count: items.length };
  },
});
