import { type DB, Repository } from '@boong/core';
import { asc } from 'drizzle-orm';
import { inject, injectable, singleton } from 'tsyringe';
import { tPost } from '../../common/db/schema';

type TPostTable = typeof tPost;

@injectable()
@singleton()
export class PostRepository extends Repository<TPostTable, number> {
	constructor(@inject('db') db: DB) {
		super(tPost, db);
	}

	test() {
		return this.paginate({
			pagination: {
				page: 1,
				limit: 1,
				order: [asc(tPost.id)],
			},
		});
	}
}
