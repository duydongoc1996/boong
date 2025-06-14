import { AModule, CORE_DI } from '@boong/core';
import { container } from 'tsyringe';
import { DI } from '../../common/types/di';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';

export class PostModule extends AModule {
	static register() {
		// Register dependencies
		container.register(DI.PostRepository, { useClass: PostRepository });
		container.register(DI.PostService, { useClass: PostService });
		container.register(DI.PostController, { useClass: PostController });

		// Register as app controller
		container.register(CORE_DI.Controller, { useClass: PostController });
	}
}
