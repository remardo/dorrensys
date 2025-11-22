import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { requireAdmin, requireSession } from './auth';

export const list = query(async ({ db }) => {
  const courses = await db.query('courses').order('desc').collect();
  return courses.sort((a, b) => b.createdAt - a.createdAt);
});

export const getCourseById = query(async ({ db }, { id }: { id: number }) => {
  return await db.query('courses').withIndex('by_itemId', (q) => q.eq('id', id)).first();
});

export const getCoursesByCategory = query(async ({ db }, { category }: { category: string }) => {
  return await db.query('courses').withIndex('by_category', (q) => q.eq('category', category)).collect();
});

export const createCourse = mutation(async ({ db }, { token, courseData }: { token?: string; courseData: any }) => {
  if (token) {
    await requireAdmin(db, token);
  }
  const now = Date.now();
  await db.insert('courses', { ...courseData, createdAt: now });
  return { success: true };
});

export const updateCourse = mutation(async ({ db }, { token, id, updates }: { token?: string; id: number; updates: any }) => {
  if (token) {
    await requireAdmin(db, token);
  }
  const existingCourse = await db.query('courses').withIndex('by_itemId', (q) => q.eq('id', id)).first();
  if (!existingCourse) throw new Error('Курс не найден');
  await db.patch(existingCourse._id, updates);
  return { success: true };
});

export const updateCourseProgress = mutation(async ({ db }, { token, id, progress }: { token: string; id: number; progress: number }) => {
  const session = await requireSession(db, token);
  if (!session) {
    throw new Error('Нет сессии');
  }
  const existingCourse = await db.query('courses').withIndex('by_itemId', (q) => q.eq('id', id)).first();
  if (!existingCourse) throw new Error('Курс не найден');
  await db.patch(existingCourse._id, { progress });
  return { success: true };
});

export const deleteCourse = mutation(async ({ db }, { token, id }: { token?: string; id: number }) => {
  if (token) {
    await requireAdmin(db, token);
  }
  const existingCourse = await db.query('courses').withIndex('by_itemId', (q) => q.eq('id', id)).first();
  if (!existingCourse) throw new Error('Курс не найден');
  await db.delete(existingCourse._id);
  return { success: true };
});

export const upsertBulk = mutation({
  args: {
    token: v.optional(v.string()),
    items: v.array(
      v.object({
        id: v.number(),
        title: v.string(),
        category: v.optional(v.string()),
        description: v.optional(v.string()),
        progress: v.number(),
        totalModules: v.number(),
        thumbnail: v.string(),
        duration: v.optional(v.string()),
        badge: v.optional(v.string()),
        modules: v.optional(
          v.array(
            v.object({
              id: v.string(),
              title: v.string(),
              type: v.string(),
              duration: v.string(),
              description: v.optional(v.string()),
              videoUrl: v.optional(v.string()),
              imageUrl: v.optional(v.string()),
              sections: v.optional(v.array(v.string())),
              content: v.optional(v.string()),
              quiz: v.optional(
                v.object({
                  title: v.string(),
                  questions: v.array(
                    v.object({
                      id: v.string(),
                      text: v.string(),
                      options: v.array(v.string()),
                      correctIndex: v.number(),
                    }),
                  ),
                }),
              ),
            }),
          ),
        ),
      }),
    ),
  },
  handler: async ({ db }, { token, items }) => {
    if (token) {
      await requireAdmin(db, token);
    }
    const now = Date.now();
    for (const item of items) {
      const existing = await db.query('courses').withIndex('by_itemId', (q) => q.eq('id', item.id)).first();
      if (existing?._id) {
        await db.patch(existing._id, { ...item });
      } else {
        await db.insert('courses', { ...item, createdAt: now });
      }
    }
    return { ok: true, count: items.length };
  },
});
