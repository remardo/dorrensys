import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  news: defineTable({
    id: v.number(),
    title: v.string(),
    category: v.string(),
    date: v.string(),
    image: v.string(),
    excerpt: v.string(),
    description: v.optional(v.string()),
    slug: v.optional(v.string()),
    body: v.optional(v.array(v.string())),
    createdAt: v.number(),
  }).index('by_slug', ['slug']).index('by_id', ['id']),
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    role: v.string(), // 'admin' | 'user'
    createdAt: v.number(),
  }).index('by_email', ['email']).index('by_role', ['role']),
  authCodes: defineTable({
    email: v.string(),
    code: v.string(),
    createdAt: v.number(),
  }).index('by_email', ['email']),
  sessions: defineTable({
    email: v.string(),
    token: v.string(),
    createdAt: v.number(),
  }).index('by_token', ['token']).index('by_email', ['email']),
  docs: defineTable({
    id: v.number(),
    title: v.string(),
    type: v.string(),
    size: v.string(),
    category: v.string(),
    updated: v.string(),
    link: v.string(),
    createdAt: v.number(),
  }).index('by_id', ['id']),
  courses: defineTable({
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
        }),
      ),
    ),
    createdAt: v.number(),
  }).index('by_id', ['id']),
  tasks: defineTable({
    id: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    priority: v.string(),
    createdAt: v.number(),
  }).index('by_status', ['status']),
  orders: defineTable({
    title: v.string(),
    type: v.string(),
    size: v.string(),
    createdAt: v.number(),
  }),
});
