import { asc, eq, InferSelectModel } from 'drizzle-orm';
import Elysia from 'elysia';
import {
	createQueryParser,
	DEFAULT_VALIDATION_OPTIONS,
	QueryParamsSchema,
	QueryParser,
} from './query-parser';
import { IBaseEntity, ICrudRepository, IRouteOptions, type TTableWithID } from './type';

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

	public paginate(
		options: IRouteOptions = {
			validation: { ...DEFAULT_VALIDATION_OPTIONS, query: QueryParamsSchema },
		},
	) {
		return new Elysia().get(
			'/',
			({ query, request }) => {
				const parsedQuery = this.queryParser.parseQuery(query);

				return this.repository.paginate({
					query: parsedQuery.where,
					pagination: {
						page: parsedQuery.page || 1,
						limit: parsedQuery.limit || 10,
						order: parsedQuery.orderBy || [asc(this.tTable.id)],
					},
				});
			},
			{
				...options.validation,
			},
		);
	}

	public findOne(options: IRouteOptions = { validation: DEFAULT_VALIDATION_OPTIONS }) {
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

	public createOne(options: IRouteOptions = { validation: DEFAULT_VALIDATION_OPTIONS }) {
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

	public createMany(options: IRouteOptions = { validation: DEFAULT_VALIDATION_OPTIONS }) {
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

	public updateOne(options: IRouteOptions = { validation: DEFAULT_VALIDATION_OPTIONS }) {
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

	public updateMany(
		options: IRouteOptions = {
			validation: { ...DEFAULT_VALIDATION_OPTIONS, query: QueryParamsSchema },
		},
	) {
		return new Elysia().patch(
			'/bulk',
			({ query, body, request }) => {
				const parsedQuery = this.queryParser.parseQuery(query);

				return this.repository.updateMany({
					query: parsedQuery.where,
					data: body as Partial<T>,
				});
			},
			{
				...options.validation,
			},
		);
	}

	public deleteOne(options: IRouteOptions = { validation: DEFAULT_VALIDATION_OPTIONS }) {
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

	public deleteMany(
		options: IRouteOptions = {
			validation: { ...DEFAULT_VALIDATION_OPTIONS, query: QueryParamsSchema },
		},
	) {
		return new Elysia().delete(
			'/bulk',
			({ query, request }) => {
				const parsedQuery = this.queryParser.parseQuery(query);

				return this.repository.deleteMany({
					query: parsedQuery.where || eq(this.tTable.id, (query as any).id),
				});
			},
			{
				...options.validation,
			},
		);
	}
}
