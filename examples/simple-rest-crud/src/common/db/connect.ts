import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

export const dataSource = drizzle(process.env.DATABASE_URL!, { schema });
export type DataSource = typeof dataSource;
