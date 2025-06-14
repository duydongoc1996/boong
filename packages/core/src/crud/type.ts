import { SQL } from 'drizzle-orm';
import { AnyPgColumn, AnyPgTable } from 'drizzle-orm/pg-core';
import { type TSchema } from 'elysia';

interface IQuery<T> extends SQL<unknown> {}

interface IFindOneOptions<T> {
	query: IQuery<T>;
}
interface IFindManyOptions<T> {
	query: IQuery<T>;
	pagination?: {
		page?: number;
		limit?: number;
		order?: SQL<unknown>[];
	};
}
interface ICreateOneOptions<T> {
	data: T | Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
}
interface ICreateManyOptions<T> {
	data: (T | Omit<T, 'id' | 'createdAt' | 'updatedAt'>)[];
}
interface IUpdateOneOptions<T> {
	query: IQuery<T>;
	data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>;
}
interface IUpdateManyOptions<T> {
	query?: IQuery<T>;
	data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>;
}
interface IDeleteOneOptions<T> {
	query: IQuery<T>;
	soft?: boolean;
}
interface IDeleteManyOptions<T> {
	query: IQuery<T>;
	soft?: boolean;
}

export type TCursor = string | number | Date;

interface IPaginateOptions<T> {
	query?: IQuery<T>;
	pagination: {
		cursor?: TCursor;
		page?: number;
		limit: number;
		order: SQL<unknown>[];
	};
}
export type TOrder = 'asc' | 'desc';
interface IPaginateResult<T> {
	items: T[];
	pagination:
		| {
				type: 'page';
				total: number;
				page: number;
		  }
		| {
				type: 'cursor';
				cursor: TCursor;
				nextCursor: TCursor | null;
				prevCursor: TCursor | null;
		  };
}

interface IRepository<T> {
	// TODO: add some common methods
}

export interface ICrudRepository<T> extends IRepository<T> {
	paginate(options: IPaginateOptions<T>): Promise<IPaginateResult<T>>;
	findOne(options: IFindOneOptions<T>): Promise<T | null>;
	findMany(options: IFindManyOptions<T>): Promise<T[]>;
	createOne(options: ICreateOneOptions<T>): Promise<T | null>;
	createMany(options: ICreateManyOptions<T>): Promise<T[]>;
	updateOne(options: IUpdateOneOptions<T>): Promise<T | null>;
	updateMany(options: IUpdateManyOptions<T>): Promise<T[]>;
	deleteOne(options: IDeleteOneOptions<T>): Promise<void>;
	deleteMany(options: IDeleteManyOptions<T>): Promise<void>;
}

export interface IBaseEntity<ID extends number | string> {
	id: ID;
	createdAt: Date;
	updatedAt: Date;
}

// Type constraint to ensure table has an id column
type TTableWithID<ID extends number | string> = AnyPgTable & {
	id: AnyPgColumn;
};

interface IValidateOptions {
	params?: TSchema;
	body?: TSchema;
	query?: TSchema;
}

interface IRouteOptions {
	validation: IValidateOptions;
}

export {
	ICreateManyOptions,
	ICreateOneOptions,
	IDeleteManyOptions,
	IDeleteOneOptions,
	IFindManyOptions,
	IFindOneOptions,
	IPaginateOptions,
	IPaginateResult,
	IQuery,
	IRepository,
	IRouteOptions,
	IUpdateManyOptions,
	IUpdateOneOptions,
	IValidateOptions,
	TTableWithID,
};
