import { InferSelectModel, relations } from 'drizzle-orm';
import { boolean, integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const tPost = pgTable('posts', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	title: varchar({ length: 255 }).notNull(),
	content: text().notNull(),
	published: boolean().notNull().default(false),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp().notNull().defaultNow(),
	authorId: integer(),
});

export type TPost = InferSelectModel<typeof tPost>;

export const rPost = relations(tPost, ({ many, one }) => ({
	author: one(tUser, {
		fields: [tPost.authorId],
		references: [tUser.id],
	}),
}));

export const tUser = pgTable('users', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	email: varchar({ length: 255 }).notNull(),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp().notNull().defaultNow(),
});

export type TUser = InferSelectModel<typeof tUser>;

export const rUser = relations(tUser, ({ many }) => ({
	posts: many(tPost),
}));
