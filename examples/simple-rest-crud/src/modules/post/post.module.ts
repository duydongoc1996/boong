import { container } from 'tsyringe';
import { PostController } from './post.controller';

const PostModule = {
	schemas: [],
	controllers: [container.resolve(PostController)],
};

container.register('PostModule', {
	useValue: PostModule,
});

export default PostModule;
