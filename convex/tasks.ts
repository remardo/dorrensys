import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { requireAdmin } from './auth';

export const list = query({
  args: {},
  handler: async ({ db }) => db.query('tasks').order('desc').collect(),
});

export const upsertBulk = mutation({
  args: {
    token: v.string(),
    items: v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        description: v.optional(v.string()),
        status: v.string(),
        priority: v.string(),
      }),
    ),
  },
  handler: async ({ db }, { token, items }) => {
    await requireAdmin(db, token);
    for (const task of items) {
      const existing = await db.query('tasks').withIndex('by_status', (q) => q.eq('status', task.status)).filter(() => false).first();
      const byId = await db.query('tasks').filter((q) => q.eq(q.field('id'), task.id)).first();
      if (byId?._id) {
        await db.patch(byId._id, { ...task });
      } else {
        await db.insert('tasks', { ...task, createdAt: Date.now() });
      }
    }
    return { ok: true, count: items.length };
  },
});
