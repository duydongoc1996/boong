import {
	SQL,
	and,
	asc,
	between,
	desc,
	eq,
	getTableColumns,
	gt,
	gte,
	ilike,
	inArray,
	isNotNull,
	isNull,
	like,
	lt,
	lte,
	ne,
	not,
	notInArray,
	or,
} from 'drizzle-orm';
import { AnyPgColumn, AnyPgTable } from 'drizzle-orm/pg-core';
import { t, type Static } from 'elysia';
import { IValidateOptions } from './type';

// Query parameter types based on Strapi's filtering system
export const FilterOperatorSchema = t.Object({
	$eq: t.Optional(t.Any()),
	$ne: t.Optional(t.Any()),
	$gt: t.Optional(t.Union([t.String(), t.Number(), t.Date()])),
	$gte: t.Optional(t.Union([t.String(), t.Number(), t.Date()])),
	$lt: t.Optional(t.Union([t.String(), t.Number(), t.Date()])),
	$lte: t.Optional(t.Union([t.String(), t.Number(), t.Date()])),
	$like: t.Optional(t.String()),
	$ilike: t.Optional(t.String()),
	$in: t.Optional(t.Array(t.Any())),
	$notIn: t.Optional(t.Array(t.Any())),
	$between: t.Optional(t.Tuple([t.Any(), t.Any()])),
	$null: t.Optional(t.Boolean()),
	$notNull: t.Optional(t.Boolean()),
	$contains: t.Optional(t.String()),
	$startsWith: t.Optional(t.String()),
	$endsWith: t.Optional(t.String()),
});

export const LogicalOperatorSchema = t.Object({
	$and: t.Optional(t.Array(t.Any())),
	$or: t.Optional(t.Array(t.Any())),
	$not: t.Optional(t.Any()),
});

export const SortSchema = t.Object({
	field: t.String(),
	order: t.Union([t.Literal('asc'), t.Literal('desc')]),
});

export const PaginationSchema = t.Object({
	page: t.Optional(t.Number({ minimum: 1 })),
	limit: t.Optional(t.Number({ minimum: 1, maximum: 100 })),
	offset: t.Optional(t.Number({ minimum: 0 })),
});

export const QueryParamsSchema = t.Object({
	filters: t.Optional(t.Object({})),
	fields: t.Optional(t.Union([t.String(), t.Array(t.String())])),
	populate: t.Optional(t.Union([t.String(), t.Array(t.String())])),
	pagination: t.Optional(PaginationSchema),
	sort: t.Optional(t.Union([t.Array(SortSchema), t.String(), t.Array(t.String())])),
});

export type TFilterOperator = Static<typeof FilterOperatorSchema>;
export type TLogicalOperator = Static<typeof LogicalOperatorSchema>;
export type TSort = Static<typeof SortSchema>;
export type TPagination = Static<typeof PaginationSchema>;
export type TQueryParams = Static<typeof QueryParamsSchema>;

// Base operator interface for extensibility
export interface IQueryOperator<T = any> {
	name: string;
	apply(column: AnyPgColumn, value: T): SQL<unknown>;
}

// Operator implementations
export class EqualsOperator implements IQueryOperator {
	name = '$eq';
	apply(column: AnyPgColumn, value: any): SQL<unknown> {
		return eq(column, value);
	}
}

export class NotEqualsOperator implements IQueryOperator {
	name = '$ne';
	apply(column: AnyPgColumn, value: any): SQL<unknown> {
		return ne(column, value);
	}
}

export class GreaterThanOperator implements IQueryOperator {
	name = '$gt';
	apply(column: AnyPgColumn, value: any): SQL<unknown> {
		return gt(column, value);
	}
}

export class GreaterThanOrEqualOperator implements IQueryOperator {
	name = '$gte';
	apply(column: AnyPgColumn, value: any): SQL<unknown> {
		return gte(column, value);
	}
}

export class LessThanOperator implements IQueryOperator {
	name = '$lt';
	apply(column: AnyPgColumn, value: any): SQL<unknown> {
		return lt(column, value);
	}
}

export class LessThanOrEqualOperator implements IQueryOperator {
	name = '$lte';
	apply(column: AnyPgColumn, value: any): SQL<unknown> {
		return lte(column, value);
	}
}

export class LikeOperator implements IQueryOperator {
	name = '$like';
	apply(column: AnyPgColumn, value: string): SQL<unknown> {
		return like(column, value);
	}
}

export class ILikeOperator implements IQueryOperator {
	name = '$ilike';
	apply(column: AnyPgColumn, value: string): SQL<unknown> {
		return ilike(column, value);
	}
}

export class InOperator implements IQueryOperator {
	name = '$in';
	apply(column: AnyPgColumn, value: any[]): SQL<unknown> {
		return inArray(column, value);
	}
}

export class NotInOperator implements IQueryOperator {
	name = '$notIn';
	apply(column: AnyPgColumn, value: any[]): SQL<unknown> {
		return notInArray(column, value);
	}
}

export class BetweenOperator implements IQueryOperator {
	name = '$between';
	apply(column: AnyPgColumn, value: [any, any]): SQL<unknown> {
		return between(column, value[0], value[1]);
	}
}

export class IsNullOperator implements IQueryOperator {
	name = '$null';
	apply(column: AnyPgColumn, value: boolean): SQL<unknown> {
		return value ? isNull(column) : isNotNull(column);
	}
}

export class IsNotNullOperator implements IQueryOperator {
	name = '$notNull';
	apply(column: AnyPgColumn, value: boolean): SQL<unknown> {
		return value ? isNotNull(column) : isNull(column);
	}
}

export class ContainsOperator implements IQueryOperator {
	name = '$contains';
	apply(column: AnyPgColumn, value: string): SQL<unknown> {
		return ilike(column, `%${value}%`);
	}
}

export class StartsWithOperator implements IQueryOperator {
	name = '$startsWith';
	apply(column: AnyPgColumn, value: string): SQL<unknown> {
		return ilike(column, `${value}%`);
	}
}

export class EndsWithOperator implements IQueryOperator {
	name = '$endsWith';
	apply(column: AnyPgColumn, value: string): SQL<unknown> {
		return ilike(column, `%${value}`);
	}
}

// Operator registry for extensibility
export class OperatorRegistry {
	private operators = new Map<string, IQueryOperator>();

	constructor() {
		// Register default operators
		this.registerDefaults();
	}

	private registerDefaults() {
		const defaultOperators = [
			new EqualsOperator(),
			new NotEqualsOperator(),
			new GreaterThanOperator(),
			new GreaterThanOrEqualOperator(),
			new LessThanOperator(),
			new LessThanOrEqualOperator(),
			new LikeOperator(),
			new ILikeOperator(),
			new InOperator(),
			new NotInOperator(),
			new BetweenOperator(),
			new IsNullOperator(),
			new IsNotNullOperator(),
			new ContainsOperator(),
			new StartsWithOperator(),
			new EndsWithOperator(),
		];

		defaultOperators.forEach((op) => this.register(op.name, op));
	}

	register(name: string, operator: IQueryOperator) {
		this.operators.set(name, operator);
	}

	get(name: string): IQueryOperator | undefined {
		return this.operators.get(name);
	}

	getAll(): Map<string, IQueryOperator> {
		return new Map(this.operators);
	}
}

// Main query parser class
export class QueryParser<TTable extends AnyPgTable> {
	private operatorRegistry = new OperatorRegistry();

	constructor(private table: TTable) {}

	// Register custom operators
	registerOperator(operator: IQueryOperator) {
		this.operatorRegistry.register(operator.name, operator);
	}

	// Parse query parameters to Drizzle SQL
	parseQuery(params: TQueryParams | Record<string, any>): {
		where?: SQL<unknown>;
		orderBy?: SQL<unknown>[];
		page?: number;
		limit?: number;
	} {
		// Handle different input types
		let parsedParams: TQueryParams = params as TQueryParams;

		const result: {
			where?: SQL<unknown>;
			orderBy?: SQL<unknown>[];
			limit?: number;
			page?: number;
		} = {};

		// Parse filters
		if (parsedParams.filters && Object.keys(parsedParams.filters).length > 0) {
			result.where = this.parseFilters(parsedParams.filters);
		}

		// Parse sorting
		if (parsedParams.sort && Object.keys(parsedParams.sort).length > 0) {
			result.orderBy = this.parseSort(parsedParams.sort);
		}

		// Parse pagination
		if (parsedParams.pagination && Object.keys(parsedParams.pagination).length > 0) {
			const { page, limit, offset } = parsedParams.pagination;

			if (page) {
				result.page = page;
			}

			if (limit) {
				result.limit = limit;
			}
		}

		return result;
	}

	private parseFilters(filters: any): SQL<unknown> {
		console.log('filters', typeof filters);

		if (!filters || typeof filters !== 'object') {
			throw new Error('Invalid filters format');
		}

		const conditions: SQL<unknown>[] = [];

		for (const [key, value] of Object.entries(filters)) {
			if (this.isLogicalOperator(key)) {
				conditions.push(this.parseLogicalOperator(key, value));
			} else if (this.isFieldFilter(key)) {
				conditions.push(this.parseFieldFilter(key, value));
			}
		}

		if (conditions.length === 0) {
			throw new Error('No valid conditions found in filters');
		}

		return conditions.length > 1 ? and(...conditions)! : conditions[0]!;
	}

	private isLogicalOperator(key: string): boolean {
		return ['$and', '$or', '$not'].includes(key);
	}

	private isFieldFilter(key: string): boolean {
		return key in getTableColumns(this.table);
	}

	private parseLogicalOperator(operator: string, value: any): SQL<unknown> {
		switch (operator) {
			case '$and':
				if (!Array.isArray(value)) {
					throw new Error('$and operator requires an array');
				}
				const andConditions = value.map((v: any) => this.parseFilters(v));
				return and(...andConditions)!;

			case '$or':
				if (!Array.isArray(value)) {
					throw new Error('$or operator requires an array');
				}
				const orConditions = value.map((v: any) => this.parseFilters(v));
				return or(...orConditions)!;

			case '$not':
				return not(this.parseFilters(value))!;

			default:
				throw new Error(`Unknown logical operator: ${operator}`);
		}
	}

	private parseFieldFilter(fieldName: string, value: any): SQL<unknown> {
		const columns = getTableColumns(this.table);
		const column = columns[fieldName] as AnyPgColumn;

		if (!column) {
			throw new Error(`Field ${fieldName} not found in table`);
		}

		// If value is not an object, treat as equality
		if (typeof value !== 'object' || value === null) {
			const eqOperator = this.operatorRegistry.get('$eq');
			if (!eqOperator) {
				throw new Error('Equals operator not found');
			}
			return eqOperator.apply(column, value);
		}

		const conditions: SQL<unknown>[] = [];

		for (const [operator, operatorValue] of Object.entries(value)) {
			const operatorImpl = this.operatorRegistry.get(operator);
			if (!operatorImpl) {
				throw new Error(`Unknown operator: ${operator}`);
			}
			conditions.push(operatorImpl.apply(column, operatorValue));
		}

		return conditions.length > 1 ? and(...conditions)! : conditions[0]!;
	}

	private parseSort(sort: any): SQL<unknown>[] {
		if (!sort) return [];

		// Handle string format: "field:asc" or "field:desc"
		if (typeof sort === 'string') {
			const [field, order = 'asc'] = sort.split(':');
			if (!field) {
				throw new Error('Invalid sort format: field name is required');
			}
			return this.createSortCondition(field, order as 'asc' | 'desc');
		}

		// Handle array of strings
		if (Array.isArray(sort) && sort.every((s) => typeof s === 'string')) {
			return sort.flatMap((s) => {
				const [field, order = 'asc'] = s.split(':');
				if (!field) {
					throw new Error('Invalid sort format: field name is required');
				}
				return this.createSortCondition(field, order as 'asc' | 'desc');
			});
		}

		// Handle array of sort objects
		if (Array.isArray(sort)) {
			return sort.flatMap((s) => this.createSortCondition(s.field, s.order));
		}

		throw new Error('Invalid sort format');
	}

	private createSortCondition(field: string, order: 'asc' | 'desc'): SQL<unknown>[] {
		const column = getTableColumns(this.table)[field] as AnyPgColumn;

		if (!column) {
			throw new Error(`Field ${field} not found in table`);
		}

		return [order === 'desc' ? desc(column) : asc(column)];
	}
}

// Utility function to create a query parser instance
export function createQueryParser<T extends AnyPgTable>(table: T): QueryParser<T> {
	return new QueryParser(table);
}

export const DEFAULT_VALIDATION_OPTIONS: IValidateOptions = {
	params: t.Optional(t.Any()),
	body: t.Optional(t.Any()),
	query: t.Optional(t.Any()),
};
