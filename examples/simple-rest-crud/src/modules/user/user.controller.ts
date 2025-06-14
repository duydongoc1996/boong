import { CrudController, ICrudRepository } from '@boong/core';
import Elysia, { t } from 'elysia';
import { inject, injectable, singleton } from 'tsyringe';
import { tUser, type TUser } from '../../common/db/schema';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@injectable()
@singleton()
export class UserController extends CrudController<number> {
	constructor(
		@inject(UserRepository) repository: UserRepository,
		@inject(UserService) private readonly service: UserService,
	) {
		// Extend base controller
		super('users', tUser, repository as ICrudRepository<TUser>);

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
					email: t.String({ format: 'email' }),
				}),
			},
		});
	}

	override createMany() {
		return super.createMany({
			validation: {
				body: t.Array(
					t.Object({
						email: t.String({ format: 'email' }),
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
					email: t.String({ format: 'email' }),
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
