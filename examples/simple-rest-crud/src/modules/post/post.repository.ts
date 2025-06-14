import { DB, Repository } from '@boong/core';
import { eq } from 'drizzle-orm';
import { inject, injectable, singleton } from 'tsyringe';
import { type DataSource } from '../../common/db/connect';
import { tPost } from '../../common/db/schema';
import { DI } from '../../common/types/di';

type TPostTable = typeof tPost;

@injectable()
@singleton()
export class PostRepository extends Repository<TPostTable, number> {
	constructor(@inject(DI.DataSource) private ds: DataSource) {
		super(tPost, ds as unknown as DB);
	}

	test() {
		return this.ds.query.tPost.findFirst({
			columns: {
				id: true,
				title: true,
				createdAt: true,
				updatedAt: true,
			},
			with: {
				author: {
					columns: {
						id: true,
						email: true,
						createdAt: true,
						updatedAt: true,
					},
				},
			},
			where: eq(tPost.id, 1),
		});
	}
}
