import { relations } from "drizzle-orm"
import { pgSchema, text, timestamp } from "drizzle-orm/pg-core"
import { organization } from "./core.js"
import { ID } from "./id.js"

const pgTable = pgSchema("example").table

export const post = pgTable("post", {
    id: ID("pst_"),
    title: text("title").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    orgId: text("org_id").references(() => organization.id, {
        onDelete: "cascade",
    }),
})

export const category = pgTable("category", {
    id: ID("cat_"),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    orgId: text("org_id").references(() => organization.id, {
        onDelete: "cascade",
    }),
})

export const postCategory = pgTable("post_category", {
    postId: text("post_id").references(() => post.id, { onDelete: "cascade" }),
    categoryId: text("category_id").references(() => category.id, {
        onDelete: "cascade",
    }),
    orgId: text("org_id").references(() => organization.id, {
        onDelete: "cascade",
    }),
})

export const postRelations = relations(post, ({ many }) => ({
    categories: many(postCategory),
}))

export const categoryRelations = relations(category, ({ many }) => ({
    posts: many(postCategory),
}))
