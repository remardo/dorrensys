import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { requireAdmin, requireSession } from './auth';

// Queries
export const getUsers = query(async ({ db }) => {
  return await db.query('users').collect();
});

export const getUserByEmail = query(async ({ db }, { email }: { email: string }) => {
  return await db.query('users').withIndex('by_email', (q) => q.eq('email', email.toLowerCase())).first();
});

export const getUserById = query(async ({ db }, { id }: { id: string }) => {
  const allUsers = await db.query('users').collect();
  return allUsers.find((user) => user._id.toString() === id);
});

export const getUsersByRole = query(async ({ db }, { role }: { role: string }) => {
  return await db.query('users').withIndex('by_role', (q) => q.eq('role', role)).collect();
});

// Mutations
export const updateUser = mutation(async ({ db }, { token, userId, updates }: { token: string; userId: string; updates: { name?: string; role?: string; avatar?: string; coins?: number; department?: string } }) => {
  await requireSession(db, token);

  const session = await requireSession(db, token);
  const currentUser = await db.query('users').withIndex('by_email', (q) => q.eq('email', session.email)).first();
  if (!currentUser) {
    throw new Error('Пользователь не найден');
  }
  if (currentUser.role !== 'admin' && currentUser._id.toString() !== userId) {
    throw new Error('Нет прав менять другого пользователя');
  }

  const allUsers = await db.query('users').collect();
  const targetUser = allUsers.find((user) => user._id.toString() === userId);
  if (!targetUser) throw new Error('Пользователь не найден');

  await db.patch(targetUser._id, updates);
  return { success: true };
});

export const deleteUser = mutation(async ({ db }, { token, userId }: { token: string; userId: string }) => {
  await requireAdmin(db, token);

  const allUsers = await db.query('users').collect();
  const userToDelete = allUsers.find((user) => user._id.toString() === userId);
  if (!userToDelete) throw new Error('Пользователь не найден');

  if (userToDelete.role === 'admin') {
    const adminCount = await db.query('users').withIndex('by_role', (q) => q.eq('role', 'admin')).collect();
    if (adminCount.length <= 1) {
      throw new Error('Нельзя удалить последнего админа');
    }
  }

  await db.delete(userToDelete._id);
  return { success: true };
});

export const updateUserRole = mutation({
  args: { token: v.optional(v.string()), email: v.string(), role: v.string() },
  handler: async ({ db }, { token, email, role }) => {
    if (token) {
      await requireAdmin(db, token);
    }
    const user = await db.query('users').withIndex('by_email', (q) => q.eq('email', email.toLowerCase())).first();
    if (!user) throw new Error('Пользователь не найден');
    await db.patch(user._id, { role });
    return { success: true };
  },
});

export const initializeUsers = mutation(async ({ db }, { users }: { users: any[] }) => {
  const existingUsers = await db.query('users').collect();
  if (existingUsers.length > 0) {
    return { success: false, message: 'Пользователи уже есть' };
  }

  const now = Date.now();
  for (const user of users) {
    await db.insert('users', {
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      coins: user.coins,
      department: user.department,
      createdAt: now,
    });
  }

  return { success: true, count: users.length };
});

export const upsertBulk = mutation({
  args: {
    token: v.optional(v.string()),
    users: v.array(
      v.object({
        email: v.string(),
        name: v.string(),
        role: v.string(),
        avatar: v.string(),
        coins: v.number(),
        department: v.optional(v.string()),
        learningProgress: v.optional(
          v.array(
            v.object({
              courseId: v.number(),
              progress: v.number(),
            }),
          ),
        ),
        tasks: v.optional(v.array(v.string())),
      }),
    ),
  },
  handler: async ({ db }, { token, users }) => {
    if (token) {
      await requireAdmin(db, token);
    }
    const now = Date.now();
    for (const user of users) {
      const existing = await db.query('users').withIndex('by_email', (q) => q.eq('email', user.email.toLowerCase())).first();
      if (existing?._id) {
        await db.patch(existing._id, { ...user });
      } else {
        await db.insert('users', { ...user, createdAt: now });
      }
    }
    return { ok: true, count: users.length };
  },
});

export const updateUserStats = mutation({
  args: {
    token: v.string(),
    updates: v.object({
      coins: v.optional(v.number()),
    }),
  },
  handler: async ({ db }, { token, updates }) => {
    const session = await requireSession(db, token);
    const user = await db.query('users').withIndex('by_email', (q) => q.eq('email', session.email)).first();
    if (!user) throw new Error('Пользователь не найден');
    await db.patch(user._id, updates);
    return { success: true };
  },
});
