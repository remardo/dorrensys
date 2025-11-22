import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    role: v.string(), // 'admin' | 'user'
    avatar: v.string(),
    coins: v.number(),
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
  }).index('by_slug', ['slug']).index('by_id', ['id']).index('by_category', ['category']),

  docs: defineTable({
    id: v.number(),
    title: v.string(),
    type: v.string(),
    size: v.string(),
    category: v.string(),
    updated: v.string(),
    link: v.string(),
    createdAt: v.number(),
  }).index('by_id', ['id']).index('by_category', ['category']).index('by_type', ['type']),

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
          quiz: v.optional(
            v.object({
              title: v.string(),
              questions: v.array(
                v.object({
                  id: v.string(),
                  text: v.string(),
                  options: v.array(v.string()),
                  correctIndex: v.number(),
                })
              ),
            })
          ),
        }),
      ),
    ),
    createdAt: v.number(),
  }).index('by_id', ['id']).index('by_category', ['category']),

  tasks: defineTable({
    id: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    priority: v.string(),
    assigneeEmail: v.optional(v.string()),
    assigneeName: v.optional(v.string()),
    assigneeAvatar: v.optional(v.string()),
    createdAt: v.number(),
  }).index('by_status', ['status']).index('by_id', ['id']).index('by_assignee', ['assigneeEmail']).index('by_priority', ['priority']),

  orders: defineTable({
    title: v.string(),
    type: v.string(),
    size: v.string(),
    createdAt: v.number(),
  }),

  home: defineTable({
    hero: v.object({
      title: v.string(),
      subtitle: v.string(),
      date: v.string(),
      image: v.string(),
      ctaText: v.optional(v.string()),
      ctaLink: v.optional(v.string()),
    }),
    tiles: v.array(
      v.object({
        title: v.string(),
        description: v.string(),
        cta: v.optional(v.string()),
        link: v.optional(v.string()),
        variant: v.optional(v.string()),
      }),
    ),
    notifications: v.array(v.string()),
    tasks: v.array(
      v.object({
        id: v.union(v.string(), v.number()),
        title: v.string(),
        time: v.string(),
        status: v.union(v.literal('pending'), v.literal('done')),
      }),
    ),
    events: v.array(
      v.object({
        title: v.string(),
        date: v.string(),
        place: v.string(),
        cta: v.optional(v.string()),
      }),
    ),
    orders: v.array(
      v.object({
        title: v.string(),
        type: v.string(),
        size: v.string(),
      }),
    ),
    createdAt: v.number(),
  }),
});
