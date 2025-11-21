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
});
