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
});
