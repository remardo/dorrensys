import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: {},
  handler: async ({ db }) => {
    const items = await db.query('news').order('desc').collect();
    return items;
  },
});

export const upsertBulk = mutation({
  args: {
    items: v.array(
      v.object({
        id: v.number(),
        title: v.string(),
        category: v.string(),
        date: v.string(),
        image: v.string(),
        excerpt: v.string(),
        description: v.optional(v.string()),
        slug: v.optional(v.string()),
        body: v.optional(v.array(v.string())),
      }),
    ),
  },
  handler: async ({ db }, { items }) => {
    for (const item of items) {
      const existing = await db.query('news').withIndex('by_id', (q) => q.eq('id', item.id)).first();
      if (existing?._id) {
        await db.patch(existing._id, { ...item });
      } else {
        await db.insert('news', { ...item, createdAt: Date.now() });
      }
    }
    return { ok: true, count: items.length };
  },
});
