import { env } from '@yolk-oss/elysia-env';
import { t } from 'elysia';

enum NODE_ENV {
	DEVELOPMENT = 'development',
	PRODUCTION = 'production',
	TEST = 'test',
}

export const envValidator = () =>
	env(
		{
			NODE_ENV: t.Enum(NODE_ENV, {
				default: 'development',
				error: 'NODE_ENV must be one of development, production, test',
			}),
			PORT: t.Number({
				default: 3000,
				error: 'PORT must be a number',
			}),
		},
		{
			onError: 'exit',
		},
	);
