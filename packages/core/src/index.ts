import 'reflect-metadata';
export * from './crud';
export * from './event';
export * from './http-server';

export function greet(name: string): string {
	return `Hello, ${name}!`;
}
