import { logger } from '@bogeychan/elysia-logger';
import cors from '@elysiajs/cors';
import { serverTiming } from '@elysiajs/server-timing';
import swagger from '@elysiajs/swagger';
import Elysia from 'elysia';
import { inject, injectable } from 'tsyringe';
import { envValidator } from './env';
import { IModule } from './types';

export interface ElysiaServerOptions {
	port: number;
	routers: Elysia[];
}

@injectable()
export class HttpServer implements IModule<Elysia, ElysiaServerOptions> {
	private app: Elysia;

	constructor(@inject('ElysiaServerOptions') private options: ElysiaServerOptions) {
		this.app = new Elysia()
			.use(swagger())
			.use(envValidator())
			.use(serverTiming())
			.use(cors())
			.use(logger({ level: 'trace' }))
			.get('/', 'Elysia server is running')
			.use(this.options.routers);

		console.log(`🦊 Elysia is initialized`);
	}

	bootstrap(): Elysia {
		this.app.listen(this.options.port, () => {
			console.log(
				`🦊 Elysia is running at ${this.app.server?.hostname}:${this.app.server?.port}`,
			);
		});

		return this.app;
	}

	shutdown(): void {
		// TODO: graceful shutdown
	}
}
