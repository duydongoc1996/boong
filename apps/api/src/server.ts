import { Elysia } from 'elysia';
import { pluginAuth } from './common/better-auth/auth';
import { pluginConfig } from './common/plugins/config';
import { pluginCors } from './common/plugins/cors';
import { pluginOpenAPI } from './common/plugins/openapi';
import { pluginDB } from './database/db';

const port = Number(process.env.PORT ?? 4000);

const server = new Elysia({
	serve: {
		maxRequestBodySize: 1024 * 1024 * 5, // 5MB
	},
})
	.use(pluginCors)
	.use(pluginConfig())
	.use(pluginDB())
	.use(pluginAuth())
	.use(pluginOpenAPI())
	.listen(port);

console.log(`API listening on http://localhost:${port}`);

export default server;
