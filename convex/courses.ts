import { mutation, query } from 'convex/server';
import { v } from 'convex/values';
import { requireAdmin, requireSession } from './auth';

// Queries - получение данных
export const getCourses = query(async ({ db }) => {
  const courses = await db.query('courses').collect();
  return courses.sort((a, b) => b.createdAt - a.createdAt);
});

export const getCourseById = query(async ({ db }, { id }: { id: number }) => {
  return await db.query('courses').withIndex('by_id', (q) => q.eq('id', id)).first();
});

export const getCoursesByCategory = query(async ({ db }, { category }: { category: string }) => {
  return await db.query('courses').withIndex('by_category', (q) => q.eq('category', category)).collect();
});

// Mutations - изменение данных
export const createCourse = mutation(async ({ db }, {
  token,
  courseData
}: {
  token: string,
  courseData: {
    id: number;
    title: string;
    category?: string;
    description?: string;
    progress: number;
    totalModules: number;
    thumbnail: string;
    duration?: string;
    badge?: string;
    modules?: any[];
  }
}) => {
  await requireAdmin(db, token);
  
  const now = Date.now();
  await db.insert('courses', {
    ...courseData,
    createdAt: now,
  });
  
  return { success: true };
});

export const updateCourse = mutation(async ({ db }, {
  token,
  id,
  updates
}: {
  token: string,
  id: number,
  updates: {
    title?: string;
    category?: string;
    description?: string;
    progress?: number;
    totalModules?: number;
    thumbnail?: string;
    duration?: string;
    badge?: string;
    modules?: any[];
  }
}) => {
  await requireAdmin(db, token);
  
  const existingCourse = await db.query('courses').withIndex('by_id', (q) => q.eq('id', id)).first();
  if (!existingCourse) {
    throw new Error('Курс не найден');
  }
  
  await db.patch(existingCourse._id, updates);
  return { success: true };
});

export const updateCourseProgress = mutation(async ({ db }, {
  token,
  id,
  progress
}: {
  token: string,
  id: number,
  progress: number
}) => {
  const session = await requireSession(db, token);
  
  const existingCourse = await db.query('courses').withIndex('by_id', (q) => q.eq('id', id)).first();
  if (!existingCourse) {
    throw new Error('Курс не найден');
  }
  
  await db.patch(existingCourse._id, { progress });
  return { success: true };
});

export const deleteCourse = mutation(async ({ db }, {
  token,
  id
}: {
  token: string,
  id: number
}) => {
  await requireAdmin(db, token);
  
  const existingCourse = await db.query('courses').withIndex('by_id', (q) => q.eq('id', id)).first();
  if (!existingCourse) {
    throw new Error('Курс не найден');
  }
  
  await db.delete(existingCourse._id);
  return { success: true };
});

// Функция для массовой инициализации данных
export const initializeCourses = mutation(async ({ db }, { 
  courses 
}: { 
  courses: any[] 
}) => {
  // Проверяем, есть ли уже курсы
  const existingCourses = await db.query('courses').collect();
  if (existingCourses.length > 0) {
    return { success: false, message: 'Курсы уже инициализированы' };
  }
  
  const now = Date.now();
  for (const course of courses) {
    await db.insert('courses', {
      id: course.id,
      title: course.title,
      category: course.category,
      description: course.description,
      progress: course.progress,
      totalModules: course.totalModules,
      thumbnail: course.thumbnail,
      duration: course.duration,
      badge: course.badge,
      modules: course.modules,
      createdAt: now - course.createdAtOffset || now,
    });
  }
  
  return { success: true, count: courses.length };
});