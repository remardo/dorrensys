import { mutation, query } from 'convex/server';
import { v } from 'convex/values';
import { requireAdmin, requireSession } from './auth';

// Queries - получение данных
export const getTasks = query(async ({ db }) => {
  const tasks = await db.query('tasks').collect();
  return tasks.sort((a, b) => b.createdAt - a.createdAt);
});

export const getTaskById = query(async ({ db }, { id }: { id: string }) => {
  return await db.query('tasks').withIndex('by_id', (q) => q.eq('id', id)).first();
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

// Mutations - изменение данных
export const createTask = mutation(async ({ db }, {
  token,
  taskData
}: {
  token: string,
  taskData: {
    id: string;
    title: string;
    description?: string;
    status: string;
    priority: string;
    assigneeEmail?: string;
    assigneeName?: string;
    assigneeAvatar?: string;
  }
}) => {
  const session = await requireSession(db, token);
  
  const now = Date.now();
  await db.insert('tasks', {
    ...taskData,
    createdAt: now,
  });
  
  return { success: true };
});

export const updateTask = mutation(async ({ db }, {
  token,
  id,
  updates
}: {
  token: string,
  id: string,
  updates: {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    assigneeEmail?: string;
    assigneeName?: string;
    assigneeAvatar?: string;
  }
}) => {
  const session = await requireSession(db, token);
  
  const existingTask = await db.query('tasks').withIndex('by_id', (q) => q.eq('id', id)).first();
  if (!existingTask) {
    throw new Error('Задача не найдена');
  }
  
  await db.patch(existingTask._id, updates);
  return { success: true };
});

export const deleteTask = mutation(async ({ db }, {
  token,
  id
}: {
  token: string,
  id: string
}) => {
  await requireAdmin(db, token);
  
  const existingTask = await db.query('tasks').withIndex('by_id', (q) => q.eq('id', id)).first();
  if (!existingTask) {
    throw new Error('Задача не найдена');
  }
  
  await db.delete(existingTask._id);
  return { success: true };
});

// Функция для массовой инициализации данных
export const initializeTasks = mutation(async ({ db }, { 
  tasks 
}: { 
  tasks: any[] 
}) => {
  // Проверяем, есть ли уже задачи
  const existingTasks = await db.query('tasks').collect();
  if (existingTasks.length > 0) {
    return { success: false, message: 'Задачи уже инициализированы' };
  }
  
  const now = Date.now();
  for (const task of tasks) {
    await db.insert('tasks', {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assigneeEmail: task.assigneeEmail,
      assigneeName: task.assigneeName,
      assigneeAvatar: task.assigneeAvatar,
      createdAt: now - task.createdAtOffset || now,
    });
  }
  
  return { success: true, count: tasks.length };
});