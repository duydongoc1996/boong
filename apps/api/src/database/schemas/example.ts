import { pgSchema, text, timestamp } from 'drizzle-orm/pg-core';
import { organization } from './core.js';

const pgTable = pgSchema('example').table;

export const post = pgTable('post', {
	id: text('id').primaryKey(),
	title: text('title').notNull(),
	content: text('content').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
	orgId: text('org_id').references(() => organization.id, {
		onDelete: 'cascade',
	}),
});

export const category = pgTable('category', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
	orgId: text('org_id').references(() => organization.id, {
		onDelete: 'cascade',
	}),
});

export const postCategory = pgTable('post_category', {
	postId: text('post_id').references(() => post.id, { onDelete: 'cascade' }),
	categoryId: text('category_id').references(() => category.id, {
		onDelete: 'cascade',
	}),
	orgId: text('org_id').references(() => organization.id, {
		onDelete: 'cascade',
	}),
});
