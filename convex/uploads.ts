import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Сервис загрузки: выдаем URL для заливки файла в Convex Storage
export const getUploadUrl = mutation(async ({ storage }) => {
  return await storage.generateUploadUrl();
});

// Возвращает подписанный URL для чтения файла по storageId
export const getFileUrl = query({
  args: { storageId: v.id('_storage') },
  handler: async ({ storage }, { storageId }) => {
    return await storage.getUrl(storageId);
  },
});
