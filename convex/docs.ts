import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { requireAdmin } from './auth';

// Список документов
export const list = query(async ({ db }) => {
  const docs = await db.query('docs').order('desc').collect();
  return docs.sort((a, b) => b.createdAt - a.createdAt);
});

export const getDocById = query(async ({ db }, { id }: { id: number }) => {
  return await db.query('docs').withIndex('by_itemId', (q) => q.eq('id', id)).first();
});

export const getDocsByCategory = query(async ({ db }, { category }: { category: string }) => {
  return await db.query('docs').withIndex('by_category', (q) => q.eq('category', category)).collect();
});

export const getDocsByType = query(async ({ db }, { type }: { type: string }) => {
  return await db.query('docs').withIndex('by_type', (q) => q.eq('type', type)).collect();
});

export const createDoc = mutation(async ({ db }, { token, docData }: { token?: string; docData: any }) => {
  if (token) {
    await requireAdmin(db, token);
  }
  const now = Date.now();
  await db.insert('docs', { ...docData, createdAt: now });
  return { success: true };
});

export const updateDoc = mutation(async ({ db }, { token, id, updates }: { token?: string; id: number; updates: any }) => {
  if (token) {
    await requireAdmin(db, token);
  }
  const existingDoc = await db.query('docs').withIndex('by_itemId', (q) => q.eq('id', id)).first();
  if (!existingDoc) throw new Error('Документ не найден');
  await db.patch(existingDoc._id, updates);
  return { success: true };
});

export const deleteDoc = mutation(async ({ db }, { token, id }: { token?: string; id: number }) => {
  if (token) {
    await requireAdmin(db, token);
  }
  const existingDoc = await db.query('docs').withIndex('by_itemId', (q) => q.eq('id', id)).first();
  if (!existingDoc) throw new Error('Документ не найден');
  await db.delete(existingDoc._id);
  return { success: true };
});

export const upsertBulk = mutation({
  args: {
    token: v.optional(v.string()),
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
    if (token) {
      await requireAdmin(db, token);
    }
    const now = Date.now();
    for (const item of items) {
      const existing = await db.query('docs').withIndex('by_itemId', (q) => q.eq('id', item.id)).first();
      if (existing?._id) {
        await db.patch(existing._id, { ...item });
      } else {
        await db.insert('docs', { ...item, createdAt: now });
      }
    }
    return { ok: true, count: items.length };
  },
});
