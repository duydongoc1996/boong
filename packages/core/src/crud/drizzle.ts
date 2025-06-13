import { drizzle } from 'drizzle-orm/node-postgres';
import { container } from 'tsyringe';

export function connectDB() {
	return drizzle(process.env.DATABASE_URL!);
}

export type DB = ReturnType<typeof connectDB>;

container.register('db', { useFactory: connectDB });
