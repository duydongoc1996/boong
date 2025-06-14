import Elysia from 'elysia';

export abstract class AModule {
	static register(): void {
		throw new Error('Not implemented');
	}
}

export interface IServer<T, O> {
	bootstrap(options: O): T;
	shutdown(): void;
}

export interface IController {
	getRouter(): Elysia;
}

export const CORE_DI = {
	// Common
	Config: Symbol('Config'),
	Logger: Symbol('Logger'),
	Controller: Symbol('Controller'),
	AppModule: Symbol('AppModule'),
	ElysiaServerOptions: Symbol('ElysiaServerOptions'),
};
