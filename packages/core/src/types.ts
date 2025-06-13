export interface IModule<T, O> {
	bootstrap(options: O): T;
	shutdown(): void;
}
