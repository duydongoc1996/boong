/**
 * BetterAuth library configuration file
 */
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { BETTER_AUTH_CONFIG } from '../src/common/better-auth/config.js';
import { connectDatabase } from '../src/database/helpers/connect.js';
import * as schemas from '../src/database/schemas/index.js';

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not set');
}

const { db } = connectDatabase({
	url: process.env.DATABASE_URL,
	schema: schemas,
	postgres: {},
	drizzle: {},
});

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
	}),
	...BETTER_AUTH_CONFIG,
});

export default auth;
