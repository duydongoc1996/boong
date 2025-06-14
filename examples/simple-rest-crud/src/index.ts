import { HttpServer } from '@boong/core';
import { container } from 'tsyringe';
import { AppModule } from './modules/app.module';

function main() {
	// Register all dependencies
	AppModule.register();

	// Start server
	container.resolve(HttpServer).bootstrap();
}

main();
