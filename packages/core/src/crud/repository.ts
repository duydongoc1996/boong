import { InferSelectModel } from 'drizzle-orm';
import { AnyPgTable, PgSelect, PgTable } from 'drizzle-orm/pg-core';
import { inject } from 'tsyringe';
import { type DB } from './drizzle';
import {
	IBaseEntity,
	ICreateManyOptions,
	ICreateOneOptions,
	ICrudRepository,
	IDeleteManyOptions,
	IDeleteOneOptions,
	IFindManyOptions,
	IFindOneOptions,
	IPaginateOptions,
	IPaginateResult,
	IUpdateManyOptions,
	IUpdateOneOptions,
} from './type';

export abstract class Repository<
	TTable extends AnyPgTable, // Table Type
	ID extends number | string, // ID Field Type
	T extends InferSelectModel<TTable> & IBaseEntity<ID> = InferSelectModel<TTable> &
		IBaseEntity<ID>, // Entity Type
> implements ICrudRepository<T>
{
	constructor(
		private tTable: TTable,
		@inject('db') private readonly db: DB,
	) {}

	async paginateByPage<Q extends PgSelect>(qb: Q, page: number = 1, limit: number = 10) {
		return qb.limit(limit).offset((page - 1) * limit);
	}

	async paginate(options: IPaginateOptions<T>): Promise<IPaginateResult<T>> {
		const { query, pagination } = options;
		const { page, cursor, limit, order } = pagination;

		const qb = this.db
			.select()
			.from(this.tTable as PgTable)
			.$dynamic();

		const where = query ? qb.where(query) : qb;
		const orderBy = order?.length ? where.orderBy(...order) : where;
		const paginatedQuery = page ? this.paginateByPage(orderBy, page, limit) : orderBy;
		const result = await paginatedQuery;

		return {
			items: result as T[],
			pagination: page
				? {
						type: 'page',
						page,
						total: result.length,
					}
				: {
						type: 'cursor',
						cursor: 0,
						nextCursor: null,
						prevCursor: null,
					},
		};
	}
	async findOne(options: IFindOneOptions<T>): Promise<T | null> {
		const { query } = options;

		const result = await this.db
			.select()
			.from(this.tTable as PgTable)
			.where(query)
			.limit(1);

		return (result[0] as T) || null;
	}

	async findMany(options: IFindManyOptions<T>): Promise<T[]> {
		const { query, pagination } = options;

		const qb = this.db
			.select()
			.from(this.tTable as PgTable)
			.where(query)
			.$dynamic();

		const orderBy = pagination?.order ? qb.orderBy(...pagination.order) : qb;
		const result = await orderBy;

		return result as T[];
	}
	async createOne(options: ICreateOneOptions<T>): Promise<T | null> {
		const { data } = options;
		const result = await this.db
			.insert(this.tTable as PgTable)
			.values(data)
			.returning();

		return (result[0] as T) || null;
	}
	async createMany(options: ICreateManyOptions<T>): Promise<T[]> {
		const { data } = options;
		const result = await this.db
			.insert(this.tTable as PgTable)
			.values(data)
			.returning();

		return result as T[];
	}
	async updateOne(options: IUpdateOneOptions<T>): Promise<T | null> {
		const { query, data } = options;

		const result = await this.db
			.update(this.tTable as PgTable)
			.set(data)
			.where(query)
			.returning();

		return (result[0] as T) || null;
	}
	async updateMany(options: IUpdateManyOptions<T>): Promise<T[]> {
		const { query, data } = options;

		const result = await this.db
			.update(this.tTable as PgTable)
			.set(data)
			.where(query)
			.returning();

		return result as T[];
	}
	async deleteOne(options: IDeleteOneOptions<T>): Promise<void> {
		const { query } = options;

		await this.db.delete(this.tTable as PgTable).where(query);

		return;
	}
	async deleteMany(options: IDeleteManyOptions<T>): Promise<void> {
		const { query } = options;

		await this.db.delete(this.tTable as PgTable).where(query);

		return;
	}
}
