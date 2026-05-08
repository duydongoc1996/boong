import { Elysia } from 'elysia';
import z from 'zod';

// Define the shape of your environment variables
export const EnvSchema = z.object({
	NODE_ENV: z.enum(['development', 'production', 'test']),
	PORT: z.coerce.number().default(3000),
	DATABASE_URL: z.url(),
});

export type Config = z.infer<typeof EnvSchema>;

const env = EnvSchema.safeParse(process.env);

if (!env.success) {
	console.error('❌ Invalid environment variables:');
	console.error(z.prettifyError(env.error));
	process.exit(1);
}

export const config = env.data;

export const pluginConfig = () =>
	new Elysia({ name: 'plugin-config' })
		.decorate('config', env.data)
		.onStart(() => {
			console.log('✅ Environment variables verified');
		});
