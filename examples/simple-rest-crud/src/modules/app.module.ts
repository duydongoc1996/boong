import { AModule, HttpServer } from '@boong/core';
import { DBModule } from '../common/db/db.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';

export class AppModule extends AModule {
	static register() {
		// Register modules
		DBModule.register();
		PostModule.register();
		UserModule.register();

		// Register server
		HttpServer.register({ port: 3000 });
	}
}
