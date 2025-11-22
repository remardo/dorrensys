import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { requireAdmin } from './auth';

// Список новостей
export const list = query(async ({ db }) => {
  const news = await db.query('news').order('desc').collect();
  return news.sort((a, b) => b.createdAt - a.createdAt);
});

// Совместимость со старым именем
export const getNews = list;

export const getNewsById = query(async ({ db }, { id }: { id: number }) => {
  return await db.query('news').withIndex('by_itemId', (q) => q.eq('id', id)).first();
});

export const getNewsBySlug = query(async ({ db }, { slug }: { slug: string }) => {
  return await db.query('news').withIndex('by_slug', (q) => q.eq('slug', slug)).first();
});

export const getNewsByCategory = query(async ({ db }, { category }: { category: string }) => {
  return await db.query('news').withIndex('by_category', (q) => q.eq('category', category)).collect();
});

export const createNews = mutation(async ({ db }, { token, newsData }: { token?: string; newsData: any }) => {
  if (token) {
    await requireAdmin(db, token);
  }
  const now = Date.now();
  await db.insert('news', {
    ...newsData,
    createdAt: now,
  });
  return { success: true };
});

export const updateNews = mutation(async ({ db }, { token, id, updates }: { token?: string; id: number; updates: any }) => {
  if (token) {
    await requireAdmin(db, token);
  }
  const existingNews = await db.query('news').withIndex('by_itemId', (q) => q.eq('id', id)).first();
  if (!existingNews) throw new Error('Новость не найдена');
  await db.patch(existingNews._id, updates);
  return { success: true };
});

export const deleteNews = mutation(async ({ db }, { token, id }: { token?: string; id: number }) => {
  if (token) {
    await requireAdmin(db, token);
  }
  const existingNews = await db.query('news').withIndex('by_itemId', (q) => q.eq('id', id)).first();
  if (!existingNews) throw new Error('Новость не найдена');
  await db.delete(existingNews._id);
  return { success: true };
});

// Массовое сохранение (используется в админке)
export const upsertBulk = mutation({
  args: {
    token: v.optional(v.string()),
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
        createdAt: v.optional(v.number()),
      }),
    ),
  },
  handler: async ({ db }, { token, items }) => {
    if (token) {
      await requireAdmin(db, token);
    }
    const now = Date.now();
    for (const item of items) {
      const existing = await db.query('news').withIndex('by_itemId', (q) => q.eq('id', item.id)).first();
      if (existing?._id) {
        await db.patch(existing._id, { ...item });
      } else {
        await db.insert('news', { ...item, createdAt: now });
      }
    }
    return { ok: true, count: items.length };
  },
});
