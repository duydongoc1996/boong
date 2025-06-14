import 'reflect-metadata';
export * from './crud';
export * from './event';
export * from './server/http-server';
export * from './types';

export function greet(name: string): string {
	return `Hello, ${name}!`;
}
