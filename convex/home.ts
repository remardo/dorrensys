import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { requireAdmin } from './auth';

export const get = query({
  args: {},
  handler: async ({ db }) => {
    const existing = await db.query('home').order('desc').first();
    return existing ?? null;
  },
});

export const upsert = mutation({
  args: {
    token: v.optional(v.string()),
    config: v.object({
      hero: v.object({
        title: v.string(),
        subtitle: v.string(),
        date: v.string(),
        image: v.string(),
        ctaText: v.optional(v.string()),
        ctaLink: v.optional(v.string()),
      }),
      tiles: v.array(
        v.object({
          title: v.string(),
          description: v.string(),
          cta: v.optional(v.string()),
          link: v.optional(v.string()),
          variant: v.optional(v.string()),
        }),
      ),
      notifications: v.array(v.string()),
      tasks: v.array(
        v.object({
          id: v.union(v.string(), v.number()),
          title: v.string(),
          time: v.string(),
          status: v.union(v.literal('pending'), v.literal('done')),
        }),
      ),
      events: v.array(
        v.object({
          title: v.string(),
          date: v.string(),
          place: v.string(),
          cta: v.optional(v.string()),
        }),
      ),
      orders: v.array(
        v.object({
          title: v.string(),
          type: v.string(),
          size: v.string(),
        }),
      ),
    }),
  },
  handler: async ({ db }, { token, config }) => {
    if (token) {
      await requireAdmin(db, token);
    }
    const existing = await db.query('home').order('desc').first();
    if (existing?._id) {
      await db.patch(existing._id, { ...config });
    } else {
      await db.insert('home', { ...config, createdAt: Date.now() });
    }
    return { ok: true };
  },
});
