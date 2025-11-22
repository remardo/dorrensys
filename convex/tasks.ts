import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { requireAdmin, requireSession } from './auth';

export const list = query(async ({ db }) => {
  const tasks = await db.query('tasks').order('desc').collect();
  return tasks.sort((a, b) => b.createdAt - a.createdAt);
});

export const getTaskById = query(async ({ db }, { id }: { id: string }) => {
  return await db.query('tasks').withIndex('by_itemId', (q) => q.eq('id', id)).first();
});

export const getTasksByStatus = query(async ({ db }, { status }: { status: string }) => {
  return await db.query('tasks').withIndex('by_status', (q) => q.eq('status', status)).collect();
});

export const getTasksByAssignee = query(async ({ db }, { assigneeEmail }: { assigneeEmail: string }) => {
  return await db.query('tasks').withIndex('by_assignee', (q) => q.eq('assigneeEmail', assigneeEmail)).collect();
});

export const getTasksByPriority = query(async ({ db }, { priority }: { priority: string }) => {
  return await db.query('tasks').withIndex('by_priority', (q) => q.eq('priority', priority)).collect();
});

export const createTask = mutation(async ({ db }, { token, taskData }: { token?: string; taskData: any }) => {
  if (token) {
    await requireSession(db, token);
  }
  const now = Date.now();
  await db.insert('tasks', { ...taskData, createdAt: now });
  return { success: true };
});

export const updateTask = mutation(async ({ db }, { token, id, updates }: { token?: string; id: string; updates: any }) => {
  if (token) {
    await requireSession(db, token);
  }
  const existingTask = await db.query('tasks').withIndex('by_itemId', (q) => q.eq('id', id)).first();
  if (!existingTask) throw new Error('Задача не найдена');
  await db.patch(existingTask._id, updates);
  return { success: true };
});

export const deleteTask = mutation(async ({ db }, { token, id }: { token?: string; id: string }) => {
  if (token) {
    await requireAdmin(db, token);
  }
  const existingTask = await db.query('tasks').withIndex('by_itemId', (q) => q.eq('id', id)).first();
  if (!existingTask) throw new Error('Задача не найдена');
  await db.delete(existingTask._id);
  return { success: true };
});

export const upsertBulk = mutation({
  args: {
    token: v.optional(v.string()),
    items: v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        description: v.optional(v.string()),
        status: v.string(),
        priority: v.string(),
        assigneeEmail: v.optional(v.string()),
        assigneeName: v.optional(v.string()),
        assigneeAvatar: v.optional(v.string()),
      }),
    ),
  },
  handler: async ({ db }, { token, items }) => {
    if (token) {
      await requireAdmin(db, token);
    }
    const now = Date.now();
    for (const item of items) {
      const existing = await db.query('tasks').withIndex('by_itemId', (q) => q.eq('id', item.id)).first();
      if (existing?._id) {
        await db.patch(existing._id, { ...item });
      } else {
        await db.insert('tasks', { ...item, createdAt: now });
      }
    }
    return { ok: true, count: items.length };
  },
});
