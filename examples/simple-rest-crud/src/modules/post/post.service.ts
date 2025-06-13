import { inject, injectable, singleton } from 'tsyringe';
import { PostRepository } from './post.repository';

@injectable()
@singleton()
export class PostService {
	constructor(@inject(PostRepository) private readonly repository: PostRepository) {}

	async test() {
		return this.repository.test();
	}
}
