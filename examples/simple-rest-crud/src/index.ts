import { HttpServer } from '@boong/core';
import { container } from 'tsyringe';
import { ROUTERS } from './modules';

function main() {
	container.register('ElysiaServerOptions', {
		useValue: {
			port: 3000,
			routers: ROUTERS,
		},
	});

	const httpServer = container.resolve(HttpServer);
	httpServer.bootstrap();
}

main();
