import { inject, injectable, singleton } from 'tsyringe';
import { UserRepository } from './user.repository';

@injectable()
@singleton()
export class UserService {
	constructor(@inject(UserRepository) private readonly repository: UserRepository) {}

	async test() {
		return this.repository.test();
	}
}
