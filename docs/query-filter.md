# Query Filter Documentation

The Query Parser provides a powerful and flexible way to convert Strapi-like query parameters into Drizzle SQL queries. It supports filtering, sorting, pagination, and is fully extensible with custom operators.

The parser uses the `qs` library for robust parsing of complex nested query strings, ensuring that even deeply nested filter structures are handled correctly.

## Table of Contents

- [Installation & Setup](#installation--setup)
- [Query String Parsing](#query-string-parsing)
- [Basic Usage](#basic-usage)
- [Filtering](#filtering)
- [Sorting](#sorting)
- [Pagination](#pagination)
- [Validation](#validation)
- [Extending with Custom Operators](#extending-with-custom-operators)
- [API Reference](#api-reference)
- [Examples](#examples)

## Installation & Setup

The query parser is part of the `@boong/core` package and requires Drizzle ORM to be configured.

```typescript
import { createQueryParser, QueryValidationSchemas } from '@boong/core/crud/query-parser';
import { users } from './schema'; // Your Drizzle table

// Create a parser instance for your table
const userQueryParser = createQueryParser(users);
```

## Query String Parsing

The query parser uses the `qs` library internally to parse complex nested query strings. This allows for proper handling of:

- Nested objects: `filters[user][name][$eq]=John`
- Arrays: `filters[status][$in][0]=active&filters[status][$in][1]=pending`
- Complex logical operations: `filters[$and][0][age][$gte]=18&filters[$and][1][status]=active`

### Parsing Options

The parser uses these `qs` options for optimal compatibility:

```typescript
{
  allowDots: true,        // Support dot notation: filters.user.name
  arrayLimit: 100,        // Limit array size for security
  parseArrays: true,      // Parse arrays properly
  allowPrototypes: false, // Security: prevent prototype pollution
  plainObjects: true      // Create plain objects without prototype
}
```

### Input Types

The `parseQuery` method accepts multiple input types:

```typescript
// Raw query string (automatically parsed with qs)
parser.parseQuery('filters[age][$gte]=18&sort=name:asc');

// Pre-parsed object (used as-is)
parser.parseQuery({ filters: { age: { $gte: 18 } }, sort: 'name:asc' });

// Empty/undefined (returns empty result)
parser.parseQuery('');
```

### Complex Query Examples

With `qs` parsing, complex nested structures work seamlessly:

```http
# Complex nested query with multiple logical operators
GET /users?filters[$and][0][$or][0][email][$contains]=admin&filters[$and][0][$or][1][role]=admin&filters[$and][1][age][$between][0]=25&filters[$and][1][age][$between][1]=65&sort[0]=name:asc&sort[1]=createdAt:desc

# Array operations with multiple values
GET /users?filters[status][$in][0]=active&filters[status][$in][1]=pending&filters[status][$in][2]=verified

# Dot notation support (alternative syntax)
GET /users?filters.age.$gte=18&filters.status.$ne=banned&sort=name:asc
```

These complex structures are automatically parsed into proper nested objects:

```typescript
{
  filters: {
    $and: [
      {
        $or: [
          { email: { $contains: 'admin' } },
          { role: 'admin' }
        ]
      },
      {
        age: { $between: [25, 65] }
      }
    ]
  },
  sort: [
    { field: 'name', order: 'asc' },
    { field: 'createdAt', order: 'desc' }
  ]
}
```

## Basic Usage

### With Elysia Routes

```typescript
import { Elysia } from 'elysia';
import { QueryValidationSchemas } from '@boong/core/crud/query-parser';

const app = new Elysia().get(
	'/users',
	({ query }) => {
		// Parse query parameters
		const parsedQuery = userQueryParser.parseQuery(query);

		// Use with Drizzle
		return db
			.select()
			.from(users)
			.where(parsedQuery.where)
			.orderBy(...(parsedQuery.orderBy || []))
			.limit(parsedQuery.limit || 10)
			.offset(parsedQuery.offset || 0);
	},
	{
		query: QueryValidationSchemas.QueryParams,
	},
);
```

## Filtering

The query parser supports a wide range of filtering operators inspired by Strapi's query system.

### Basic Filters

```http
GET /users?filters[email]=john@example.com
GET /users?filters[age]=25
```

### Comparison Operators

| Operator | Description           | Example                          |
| -------- | --------------------- | -------------------------------- |
| `$eq`    | Equal to              | `?filters[age][$eq]=25`          |
| `$ne`    | Not equal to          | `?filters[status][$ne]=inactive` |
| `$gt`    | Greater than          | `?filters[age][$gt]=18`          |
| `$gte`   | Greater than or equal | `?filters[age][$gte]=18`         |
| `$lt`    | Less than             | `?filters[age][$lt]=65`          |
| `$lte`   | Less than or equal    | `?filters[age][$lte]=65`         |

### String Operators

| Operator      | Description                  | Example                                   |
| ------------- | ---------------------------- | ----------------------------------------- |
| `$like`       | SQL LIKE (case-sensitive)    | `?filters[name][$like]=John%`             |
| `$ilike`      | SQL ILIKE (case-insensitive) | `?filters[name][$ilike]=john%`            |
| `$contains`   | Contains substring           | `?filters[name][$contains]=john`          |
| `$startsWith` | Starts with                  | `?filters[email][$startsWith]=admin`      |
| `$endsWith`   | Ends with                    | `?filters[email][$endsWith]=@company.com` |

### Array Operators

| Operator | Description        | Example                                                           |
| -------- | ------------------ | ----------------------------------------------------------------- |
| `$in`    | Value in array     | `?filters[status][$in][0]=active&filters[status][$in][1]=pending` |
| `$notIn` | Value not in array | `?filters[role][$notIn][0]=guest&filters[role][$notIn][1]=banned` |

### Null Operators

| Operator   | Description | Example                                |
| ---------- | ----------- | -------------------------------------- |
| `$null`    | Is null     | `?filters[deletedAt][$null]=true`      |
| `$notNull` | Is not null | `?filters[lastLoginAt][$notNull]=true` |

### Range Operators

| Operator   | Description        | Example                                                      |
| ---------- | ------------------ | ------------------------------------------------------------ |
| `$between` | Between two values | `?filters[age][$between][0]=18&filters[age][$between][1]=65` |

### Logical Operators

#### AND (default behavior)

Multiple filters are combined with AND by default:

```http
GET /users?filters[age][$gte]=18&filters[status]=active
```

#### Explicit AND

```http
GET /users?filters[$and][0][age][$gte]=18&filters[$and][1][status]=active
```

#### OR

```http
GET /users?filters[$or][0][email][$contains]=admin&filters[$or][1][role]=admin
```

#### NOT

```http
GET /users?filters[$not][status]=banned
```

### Complex Nested Queries

```http
GET /users?filters[$and][0][$or][0][email][$contains]=admin&filters[$and][0][$or][1][role]=admin&filters[$and][1][age][$gte]=18
```

This translates to: `(email CONTAINS 'admin' OR role = 'admin') AND age >= 18`

## Sorting

### Simple Sort

```http
GET /users?sort=name
GET /users?sort=name:asc
GET /users?sort=age:desc
```

### Multiple Sort Fields

```http
GET /users?sort[0]=name:asc&sort[1]=age:desc
```

### Sort Object Format

```typescript
// In TypeScript/JavaScript
const query = {
	sort: [
		{ field: 'name', order: 'asc' },
		{ field: 'createdAt', order: 'desc' },
	],
};
```

## Pagination

### Page-based Pagination

```http
GET /users?pagination[page]=1&pagination[limit]=20
```

### Offset-based Pagination

```http
GET /users?pagination[offset]=0&pagination[limit]=20
```

### Default Values

- Default `limit`: No default (must be specified)
- Maximum `limit`: 100
- Default `page`: 1

## Validation

The query parser includes comprehensive Elysia validation schemas:

```typescript
import { QueryValidationSchemas } from '@boong/core/crud/query-parser';

// Use in your Elysia routes
app.get('/users', handler, {
	query: QueryValidationSchemas.QueryParams,
});

// Or use individual schemas
app.get('/users', handler, {
	query: t.Object({
		filters: t.Optional(t.Any()),
		sort: QueryValidationSchemas.Sort,
		pagination: QueryValidationSchemas.Pagination,
	}),
});
```

## Extending with Custom Operators

You can easily add custom operators to extend the query parser's functionality:

```typescript
// Define a custom operator
class RegexOperator implements IQueryOperator {
	name = '$regex';

	apply(column: AnyPgColumn, value: string): SQL<unknown> {
		// PostgreSQL regex operator
		return sql`${column} ~ ${value}`;
	}
}

// Register the operator
const parser = createQueryParser(users);
parser.registerOperator(new RegexOperator());

// Now you can use it in queries
// GET /users?filters[email][$regex]=^admin.*@company\.com$
```

### Custom Operator Interface

```typescript
interface IQueryOperator<T = any> {
	name: string;
	apply(column: AnyPgColumn, value: T): SQL<unknown>;
}
```

## API Reference

### `createQueryParser<T>(table: T): QueryParser<T>`

Creates a new query parser instance for the specified Drizzle table.

### `QueryParser.parseQuery(params: TQueryParams | string | Record<string, any>)`

Parses query parameters and returns an object with:

```typescript
{
  where?: SQL<unknown>;      // WHERE clause conditions
  orderBy?: SQL<unknown>[];  // ORDER BY clauses
  limit?: number;            // LIMIT value
  offset?: number;           // OFFSET value
}
```

**Parameters:**

- `params` - Can be a raw query string, pre-parsed object, or TQueryParams
- Returns parsed query components ready for use with Drizzle

### `QueryParser.registerOperator(operator: IQueryOperator)`

Registers a custom operator with the parser.

### Validation Schemas

- `QueryValidationSchemas.QueryParams` - Complete query validation
- `QueryValidationSchemas.FilterOperator` - Filter operator validation
- `QueryValidationSchemas.Sort` - Sort validation
- `QueryValidationSchemas.Pagination` - Pagination validation

## Examples

### Complete Example with Drizzle and Elysia

```typescript
import { Elysia } from 'elysia';
import { drizzle } from 'drizzle-orm/node-postgres';
import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { createQueryParser, QueryValidationSchemas } from '@boong/core/crud/query-parser';

// Define your table
const users = pgTable('users', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull(),
	age: integer('age'),
	status: text('status').default('active'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

// Create parser
const userQueryParser = createQueryParser(users);

// Setup database
const db = drizzle(process.env.DATABASE_URL!);

// Create Elysia app
const app = new Elysia().get(
	'/users',
	async ({ query }) => {
		const parsedQuery = userQueryParser.parseQuery(query);

		const result = await db
			.select()
			.from(users)
			.where(parsedQuery.where)
			.orderBy(...(parsedQuery.orderBy || []))
			.limit(parsedQuery.limit || 10)
			.offset(parsedQuery.offset || 0);

		return {
			data: result,
			pagination: {
				limit: parsedQuery.limit || 10,
				offset: parsedQuery.offset || 0,
			},
		};
	},
	{
		query: QueryValidationSchemas.QueryParams,
	},
);
```

### Example Queries

```http
# Get active users over 18, sorted by name
GET /users?filters[status]=active&filters[age][$gte]=18&sort=name:asc

# Get users with admin email or admin role
GET /users?filters[$or][0][email][$contains]=admin&filters[$or][1][role]=admin

# Get paginated results
GET /users?pagination[page]=2&pagination[limit]=25

# Complex query: Active users aged 25-40, excluding banned users
GET /users?filters[$and][0][status]=active&filters[$and][1][age][$between][0]=25&filters[$and][1][age][$between][1]=40&filters[$not][status]=banned&sort[0]=name:asc&sort[1]=createdAt:desc&pagination[limit]=20
```

### Error Handling

The query parser throws descriptive errors for invalid queries:

```typescript
try {
	const parsedQuery = userQueryParser.parseQuery(query);
} catch (error) {
	// Handle parsing errors
	console.error('Query parsing failed:', error.message);
	// Examples of error messages:
	// - "Field 'invalidField' not found in table"
	// - "Unknown operator: $invalidOp"
	// - "$and operator requires an array"
}
```

### Performance Tips

1. **Use indexes**: Ensure your database has appropriate indexes for filtered columns
2. **Limit results**: Always specify reasonable pagination limits
3. **Validate input**: Use the provided validation schemas to catch invalid queries early
4. **Cache complex queries**: Consider caching results for frequently used complex queries

## Security Considerations

1. **SQL Injection**: The query parser uses Drizzle's parameterized queries, protecting against SQL injection
2. **Resource Limits**: Pagination limits are enforced (max 100 per request)
3. **Field Validation**: Only valid table columns can be queried
4. **Input Validation**: All operators and values are validated through Elysia schemas
5. **Query String Parsing**: Uses secure `qs` options to prevent prototype pollution and limit array sizes

```

```
