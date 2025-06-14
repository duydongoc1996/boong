import { drizzle } from 'drizzle-orm/node-postgres';

export function connectDB() {
	return drizzle(process.env.DATABASE_URL!);
}

export type DB = ReturnType<typeof connectDB>;
