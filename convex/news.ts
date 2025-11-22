import { mutation, query } from 'convex/server';
import { v } from 'convex/values';
import { requireAdmin, requireSession } from './auth';

// Queries - получение данных
export const getNews = query(async ({ db }) => {
  const news = await db.query('news').order('desc').collect();
  return news.sort((a, b) => b.createdAt - a.createdAt);
});

export const getNewsById = query(async ({ db }, { id }: { id: number }) => {
  return await db.query('news').withIndex('by_id', (q) => q.eq('id', id)).first();
});

export const getNewsBySlug = query(async ({ db }, { slug }: { slug: string }) => {
  return await db.query('news').withIndex('by_slug', (q) => q.eq('slug', slug)).first();
});

export const getNewsByCategory = query(async ({ db }, { category }: { category: string }) => {
  return await db.query('news').withIndex('by_category', (q) => q.eq('category', category)).collect();
});

// Mutations - изменение данных
export const createNews = mutation(async ({ db }, { 
  token, 
  newsData 
}: { 
  token: string, 
  newsData: {
    id: number;
    title: string;
    category: string;
    date: string;
    image: string;
    excerpt: string;
    description?: string;
    slug?: string;
    body?: string[];
  }
}) => {
  await requireAdmin(db, token);
  
  const now = Date.now();
  await db.insert('news', {
    ...newsData,
    createdAt: now,
  });
  
  return { success: true };
});

export const updateNews = mutation(async ({ db }, {
  token,
  id,
  updates
}: {
  token: string,
  id: number,
  updates: Partial<{
    title: string;
    category: string;
    date: string;
    image: string;
    excerpt: string;
    description?: string;
    slug?: string;
    body?: string[];
  }>
}) => {
  await requireAdmin(db, token);
  
  const existingNews = await db.query('news').withIndex('by_id', (q) => q.eq('id', id)).first();
  if (!existingNews) {
    throw new Error('Новость не найдена');
  }
  
  await db.patch(existingNews._id, updates);
  return { success: true };
});

export const deleteNews = mutation(async ({ db }, {
  token,
  id
}: {
  token: string,
  id: number
}) => {
  await requireAdmin(db, token);
  
  const existingNews = await db.query('news').withIndex('by_id', (q) => q.eq('id', id)).first();
  if (!existingNews) {
    throw new Error('Новость не найдена');
  }
  
  await db.delete(existingNews._id);
  return { success: true };
});

// Функция для массовой инициализации данных
export const initializeNews = mutation(async ({ db }, { 
  newsItems 
}: { 
  newsItems: any[] 
}) => {
  // Проверяем, есть ли уже данные
  const existingNews = await db.query('news').collect();
  if (existingNews.length > 0) {
    return { success: false, message: 'Новости уже инициализированы' };
  }
  
  const now = Date.now();
  for (const newsItem of newsItems) {
    await db.insert('news', {
      ...newsItem,
      createdAt: now - newsItem.createdAtOffset || now,
    });
  }
  
  return { success: true, count: newsItems.length };
});