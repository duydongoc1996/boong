import { type DB, Repository } from '@boong/core';
import { asc } from 'drizzle-orm';
import { inject, injectable, singleton } from 'tsyringe';
import { type DataSource } from '../../common/db/connect';
import { tUser } from '../../common/db/schema';
import { DI } from '../../common/types/di';

type TUserTable = typeof tUser;

@injectable()
@singleton()
export class UserRepository extends Repository<TUserTable, number> {
	constructor(@inject(DI.DataSource) private ds: DataSource) {
		super(tUser, ds as unknown as DB);
	}

	test() {
		return this.paginate({
			pagination: {
				page: 1,
				limit: 1,
				order: [asc(tUser.id)],
			},
		});
	}
}
