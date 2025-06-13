import { asc, eq, InferSelectModel } from 'drizzle-orm';
import Elysia from 'elysia';
import { createQueryParser, QueryParser, QueryValidationSchemas } from './query-parser';
import {
	DEFAULT_VALIDATION,
	IBaseEntity,
	ICrudRepository,
	IRouteOptions,
	type TTableWithID,
} from './type';

export abstract class CrudController<
	ID extends number | string,
	TTable extends TTableWithID<ID> = TTableWithID<ID>,
	T extends InferSelectModel<TTable> & IBaseEntity<ID> = InferSelectModel<TTable> &
		IBaseEntity<ID>,
> {
	private routeFactories: (() => Elysia)[] = [];
	private router: Elysia | null = null;
	public queryParser: QueryParser<TTable>;

	constructor(
		private readonly uri: string,
		private readonly tTable: TTable,
		private readonly repository: ICrudRepository<T>,
	) {
		this.queryParser = createQueryParser(this.tTable);

		this.routeFactories = [
			() => this.paginate(),
			() => this.findOne(),
			() => this.createOne(),
			() => this.createMany(),
			() => this.updateOne(),
			() => this.updateMany(),
			() => this.deleteOne(),
			() => this.deleteMany(),
		];
	}

	protected registerRoute(factory: () => Elysia) {
		this.routeFactories.push(factory);
	}

	getRouter() {
		return (
			this.router ??
			new Elysia().group(this.uri, (app) => {
				return this.routeFactories.reduce((acc, factory) => {
					return acc.use(factory());
				}, app);
			})
		);
	}

	paginate(options: IRouteOptions = { validation: DEFAULT_VALIDATION }) {
		return new Elysia().get(
			'/',
			({ query, request }) => {
				const url = new URL(request.url);
				const queryString = url.search.substring(1);
				const parsedQuery = this.queryParser.parseQuery(queryString);

				return this.repository.paginate({
					query: parsedQuery.where,
					pagination: {
						page:
							parsedQuery.offset && parsedQuery.limit
								? Math.floor(parsedQuery.offset / parsedQuery.limit) + 1
								: 1,
						limit: parsedQuery.limit || 10,
						order: parsedQuery.orderBy || [asc(this.tTable.id)],
					},
				});
			},
			{
				...options.validation,
				query: options.validation.query || QueryValidationSchemas.QueryParams,
			},
		);
	}

	findOne(options: IRouteOptions = { validation: DEFAULT_VALIDATION }) {
		return new Elysia().get(
			'/:id',
			({ params }) => {
				return this.repository.findOne({
					query: eq(this.tTable.id, params.id),
				});
			},
			{
				...options.validation,
			},
		);
	}

	createOne(options: IRouteOptions = { validation: DEFAULT_VALIDATION }) {
		return new Elysia().post(
			'/',
			({ body }) => {
				return this.repository.createOne({
					data: body as T,
				});
			},
			{
				...options.validation,
			},
		);
	}

	createMany(options: IRouteOptions = { validation: DEFAULT_VALIDATION }) {
		return new Elysia().post(
			'/bulk',
			({ body }) => {
				return this.repository.createMany({
					data: body as T[],
				});
			},
			{
				...options.validation,
			},
		);
	}

	updateOne(options: IRouteOptions = { validation: DEFAULT_VALIDATION }) {
		return new Elysia().patch(
			'/:id',
			({ params, body }) => {
				return this.repository.updateOne({
					query: eq(this.tTable.id, params.id),
					data: body as Partial<T>,
				});
			},
			{
				...options.validation,
			},
		);
	}

	updateMany(options: IRouteOptions = { validation: DEFAULT_VALIDATION }) {
		return new Elysia().patch(
			'/bulk',
			({ query, body, request }) => {
				const url = new URL(request.url);
				const queryString = url.search.substring(1);
				const parsedQuery = this.queryParser.parseQuery(queryString);

				return this.repository.updateMany({
					query: parsedQuery.where,
					data: body as Partial<T>,
				});
			},
			{
				...options.validation,
				query: options.validation.query || QueryValidationSchemas.QueryParams,
			},
		);
	}

	deleteOne(options: IRouteOptions = { validation: DEFAULT_VALIDATION }) {
		return new Elysia().delete(
			'/:id',
			({ params }) => {
				return this.repository.deleteOne({
					query: eq(this.tTable.id, params.id),
				});
			},
			{
				...options.validation,
			},
		);
	}

	deleteMany(options: IRouteOptions = { validation: DEFAULT_VALIDATION }) {
		return new Elysia().delete(
			'/bulk',
			({ query, request }) => {
				const url = new URL(request.url);
				const queryString = url.search.substring(1);
				const parsedQuery = this.queryParser.parseQuery(queryString);

				return this.repository.deleteMany({
					query: parsedQuery.where || eq(this.tTable.id, (query as any).id),
				});
			},
			{
				...options.validation,
				query: options.validation.query || QueryValidationSchemas.QueryParams,
			},
		);
	}
}
