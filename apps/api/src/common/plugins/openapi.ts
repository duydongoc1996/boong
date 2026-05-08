import { openapi } from '@elysia/openapi';
import z from 'zod';
import { getOpenApiSchema } from '../better-auth/auth';

const BETTER_AUTH_SCHEMA = await getOpenApiSchema('/api/auth');

export const pluginOpenAPI = () =>
    openapi({
        provider: 'scalar',
        path: '/docs',
        documentation: {
            info: {
                title: 'Elysia & Better Auth API',
                version: '1.0.0',
            },
            paths: BETTER_AUTH_SCHEMA.paths,
            components: BETTER_AUTH_SCHEMA.components,
        },
        mapJsonSchema: {
            zod: z.toJSONSchema,
        },
    });
