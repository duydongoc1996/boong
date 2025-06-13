import { t, type TSchema } from 'elysia';

const schema = t.Object({
	title: t.String(),
	content: t.String(),
	published: t.Boolean(),
});

// Now you can create any schema and assign to this type
const a: TSchema = t.Any();

const b: TSchema = t.String();

const c: TSchema = t.Object({
	name: t.String(),
	age: t.Number(),
});

// You can also get the static type from any schema like this:
type SchemaType = typeof schema.static;
// This gives you: { title: string; content: string; published: boolean }
