import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const KeyValue = pgTable('key_values', {
	id: varchar('id').primaryKey(),
	key: varchar('key').notNull().unique(),
	value: varchar('value').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
