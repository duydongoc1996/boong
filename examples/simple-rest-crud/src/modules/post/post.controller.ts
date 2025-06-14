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
					authorId: t.Number(),
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
						authorId: t.Number(),
					}),
				),
			},
		});
	}

	override updateOne() {
		return super.updateOne({
			validation: {
				params: t.Object({
					id: t.Number(),
				}),
				body: t.Object({
					title: t.Optional(t.String()),
					content: t.Optional(t.String()),
					published: t.Optional(t.Boolean()),
					authorId: t.Optional(t.Number()),
				}),
			},
		});
	}

	test() {
		return new Elysia().get('/test', () => {
			return this.service.test();
		});
	}
}
