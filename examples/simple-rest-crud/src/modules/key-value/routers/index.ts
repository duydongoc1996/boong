import Elysia from 'elysia';
import { KeyValue } from '../entities/key-value';
import handlers from '../handlers';

const controllers = {
	findMany: new Elysia().get('/', ({ query }) => {
		return handlers.findMany();
	}),
	findOne: new Elysia().get('/:id', ({ params }) => {
		return handlers.findOne(params.id);
	}),
	createOne: new Elysia().post('/', ({ body }) => {
		return handlers.createOne(body as KeyValue);
	}),
	createMany: new Elysia().post('/bulk', ({ body }) => {
		return handlers.createMany(body as KeyValue[]);
	}),
	updateOne: new Elysia().patch('/:id', ({ params, body }) => {
		return handlers.updateOne(params.id, body as KeyValue);
	}),
	updateMany: new Elysia().patch('/bulk', ({ body }) => {
		return handlers.updateMany(body as KeyValue[]);
	}),
	deleteOne: new Elysia().delete('/:id', ({ params }) => {
		return handlers.deleteOne(params.id);
	}),
	deleteMany: new Elysia().delete('/bulk', ({ query }) => {
		return handlers.deleteMany(query.ids as unknown as string[]);
	}),
};

const routers = new Elysia().group('/key-values', (app) =>
	app
		.use(controllers.findMany)
		.use(controllers.findOne)
		.use(controllers.createOne)
		.use(controllers.createMany)
		.use(controllers.updateOne)
		.use(controllers.updateMany)
		.use(controllers.deleteOne)
		.use(controllers.deleteMany),
);

export default routers;
