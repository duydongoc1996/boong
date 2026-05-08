import { Elysia } from 'elysia';

export const postRoutes = new Elysia({ prefix: '/posts' }).get('/', () => {
	return {
		message: 'Posts fetched successfully',
		data: [
			{
				id: 1,
				title: 'Post 1',
				content: 'Content 1',
			},
		],
	};
});
