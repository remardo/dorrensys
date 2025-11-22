import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { requireAdmin, requireSession } from './auth';

// Queries - получение данных
export const getUsers = query(async ({ db }) => {
  return await db.query('users').collect();
});

export const getUserByEmail = query(async ({ db }, { email }: { email: string }) => {
  return await db.query('users').withIndex('by_email', (q) => q.eq('email', email.toLowerCase())).first();
});

export const getUserById = query(async ({ db }, { id }: { id: string }) => {
  const allUsers = await db.query('users').collect();
  return allUsers.find(user => user._id.toString() === id);
});

export const getUsersByRole = query(async ({ db }, { role }: { role: string }) => {
  return await db.query('users').withIndex('by_role', (q) => q.eq('role', role)).collect();
});

// Mutations - изменение данных
export const updateUser = mutation(async ({ db }, {
  token,
  userId,
  updates
}: {
  token: string,
  userId: string,
  updates: {
    name?: string;
    role?: string;
    avatar?: string;
    coins?: number;
  }
}) => {
  await requireSession(db, token);
  
  // Проверяем, что пользователь имеет права на обновление (админ или обновляет себя)
  const session = await requireSession(db, token);
  const currentUser = await db.query('users').withIndex('by_email', (q) => q.eq('email', session.email)).first();
  
  if (!currentUser) {
    throw new Error('Пользователь не найден');
  }
  
  // Проверяем права доступа
  if (currentUser.role !== 'admin' && currentUser._id.toString() !== userId) {
    throw new Error('Недостаточно прав для обновления пользователя');
  }
  
  // Находим пользователя для обновления
  const allUsers = await db.query('users').collect();
  const targetUser = allUsers.find(user => user._id.toString() === userId);
  
  if (!targetUser) {
    throw new Error('Пользователь для обновления не найден');
  }
  
  await db.patch(targetUser._id, updates);
  return { success: true };
});

export const deleteUser = mutation(async ({ db }, {
  token,
  userId
}: {
  token: string,
  userId: string
}) => {
  await requireAdmin(db, token);
  
  const allUsers = await db.query('users').collect();
  const userToDelete = allUsers.find(user => user._id.toString() === userId);
  
  if (!userToDelete) {
    throw new Error('Пользователь не найден');
  }
  
  // Нельзя удалить последнего администратора
  if (userToDelete.role === 'admin') {
    const adminCount = await db.query('users').withIndex('by_role', (q) => q.eq('role', 'admin')).collect();
    if (adminCount.length <= 1) {
      throw new Error('Нельзя удалить последнего администратора');
    }
  }
  
  await db.delete(userToDelete._id);
  return { success: true };
});

// Обновление роли по email (admin only)
export const updateUserRole = mutation({
  args: { token: v.string(), email: v.string(), role: v.string() },
  handler: async ({ db }, { token, email, role }) => {
    await requireAdmin(db, token);
    const user = await db.query('users').withIndex('by_email', (q) => q.eq('email', email.toLowerCase())).first();
    if (!user) throw new Error('Пользователь не найден');
    await db.patch(user._id, { role });
    return { success: true };
  },
});

// Функция для массовой инициализации данных
export const initializeUsers = mutation(async ({ db }, { 
  users 
}: { 
  users: any[] 
}) => {
  // Проверяем, есть ли уже пользователи
  const existingUsers = await db.query('users').collect();
  if (existingUsers.length > 0) {
    return { success: false, message: 'Пользователи уже инициализированы' };
  }
  
  const now = Date.now();
  for (const user of users) {
    await db.insert('users', {
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      coins: user.coins,
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

// Функция для обновления статистики пользователя
export const updateUserStats = mutation(async ({ db }, {
  token,
  updates
}: {
  token: string,
  updates: {
    coins?: number;
  }
}) => {
  const session = await requireSession(db, token);
  const user = await db.query('users').withIndex('by_email', (q) => q.eq('email', session.email)).first();
  
  if (!user) {
    throw new Error('Пользователь не найден');
  }
  
  await db.patch(user._id, updates);
  return { success: true };
});
