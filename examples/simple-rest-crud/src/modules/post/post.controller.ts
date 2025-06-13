import { CrudController, ICrudRepository } from '@boong/core';
import Elysia, { t } from 'elysia';
import { inject, injectable, singleton } from 'tsyringe';
import { tPost, type TPost } from '../../common/db/schema';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';

@injectable()
@singleton()
export class PostController extends CrudController<number> {
	constructor(
		@inject(PostRepository) repository: PostRepository,
		@inject(PostService) private readonly service: PostService,
	) {
		// Extend base controller
		super('posts', tPost, repository as ICrudRepository<TPost>);

		// Register custom routes
		this.registerRoute(() => this.test());
	}

	override findOne() {
		return super.findOne({
			validation: {
				params: t.Object({
					id: t.Number(),
				}),
			},
		});
	}

	override createOne() {
		return super.createOne({
			validation: {
				body: t.Object({
					title: t.String(),
					content: t.String(),
					published: t.Boolean(),
				}),
			},
		});
	}

	override createMany() {
		return super.createMany({
			validation: {
				body: t.Array(
					t.Object({
						title: t.String(),
						content: t.String(),
						published: t.Boolean(),
					}),
				),
			},
		});
	}

	test() {
		return new Elysia().get('/test', () => {
			return this.service.test();
		});
	}
}
