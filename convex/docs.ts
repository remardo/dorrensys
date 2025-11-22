import { mutation, query } from 'convex/server';
import { v } from 'convex/values';
import { requireAdmin, requireSession } from './auth';

// Queries - получение данных
export const getDocs = query(async ({ db }) => {
  const docs = await db.query('docs').collect();
  return docs.sort((a, b) => b.createdAt - a.createdAt);
});

export const getDocById = query(async ({ db }, { id }: { id: number }) => {
  return await db.query('docs').withIndex('by_id', (q) => q.eq('id', id)).first();
});

export const getDocsByCategory = query(async ({ db }, { category }: { category: string }) => {
  return await db.query('docs').withIndex('by_category', (q) => q.eq('category', category)).collect();
});

export const getDocsByType = query(async ({ db }, { type }: { type: string }) => {
  return await db.query('docs').withIndex('by_type', (q) => q.eq('type', type)).collect();
});

// Mutations - изменение данных
export const createDoc = mutation(async ({ db }, {
  token,
  docData
}: {
  token: string,
  docData: {
    id: number;
    title: string;
    type: string;
    size: string;
    category: string;
    updated: string;
    link: string;
  }
}) => {
  await requireAdmin(db, token);
  
  const now = Date.now();
  await db.insert('docs', {
    ...docData,
    createdAt: now,
  });
  
  return { success: true };
});

export const updateDoc = mutation(async ({ db }, {
  token,
  id,
  updates
}: {
  token: string,
  id: number,
  updates: {
    title?: string;
    type?: string;
    size?: string;
    category?: string;
    updated?: string;
    link?: string;
  }
}) => {
  await requireAdmin(db, token);
  
  const existingDoc = await db.query('docs').withIndex('by_id', (q) => q.eq('id', id)).first();
  if (!existingDoc) {
    throw new Error('Документ не найден');
  }
  
  await db.patch(existingDoc._id, updates);
  return { success: true };
});

export const deleteDoc = mutation(async ({ db }, {
  token,
  id
}: {
  token: string,
  id: number
}) => {
  await requireAdmin(db, token);
  
  const existingDoc = await db.query('docs').withIndex('by_id', (q) => q.eq('id', id)).first();
  if (!existingDoc) {
    throw new Error('Документ не найден');
  }
  
  await db.delete(existingDoc._id);
  return { success: true };
});

// Функция для массовой инициализации данных
export const initializeDocs = mutation(async ({ db }, { 
  docs 
}: { 
  docs: any[] 
}) => {
  // Проверяем, есть ли уже документы
  const existingDocs = await db.query('docs').collect();
  if (existingDocs.length > 0) {
    return { success: false, message: 'Документы уже инициализированы' };
  }
  
  const now = Date.now();
  for (const doc of docs) {
    await db.insert('docs', {
      id: doc.id,
      title: doc.title,
      type: doc.type,
      size: doc.size,
      category: doc.category,
      updated: doc.updated,
      link: doc.link,
      createdAt: now - doc.createdAtOffset || now,
    });
  }
  
  return { success: true, count: docs.length };
});