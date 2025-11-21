import { defineApp } from 'convex/server';
import schema from './schema';

// Базовая конфигурация Convex. Для запуска: `npx convex dev` или `npx convex deploy` после логина.
export default defineApp({
  schema,
  auth: { providers: [] },
  functions: {
    '': {
      web: {},
    },
  },
});
