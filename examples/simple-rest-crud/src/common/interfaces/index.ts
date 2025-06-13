export interface CrudService<T> {
	findMany(query: any): Promise<T[]>;
	findOne(id: string): Promise<T>;
	createMany(data: T[]): Promise<T[]>;
	createOne(data: T): Promise<T>;
	updateMany(id: string, data: T): Promise<T>;
	updateOne(id: string, data: T): Promise<T>;
	deleteMany(ids: string[]): Promise<void>;
	deleteOne(id: string): Promise<void>;
}

export interface CrudRepository<T> {
	findMany(query: any): Promise<T[]>;
	findOne(id: string): Promise<T>;
	createMany(data: T[]): Promise<T[]>;
	createOne(data: T): Promise<T>;
	updateMany(id: string, data: T): Promise<T>;
	updateOne(id: string, data: T): Promise<T>;
	deleteMany(ids: string[]): Promise<void>;
	deleteOne(id: string): Promise<void>;
}

export interface CrudController<T> {
	findMany(query: any): Promise<T[]>;
	findOne(id: string): Promise<T>;
	createMany(data: T[]): Promise<T[]>;
	createOne(data: T): Promise<T>;
	updateMany(id: string, data: T): Promise<T>;
	updateOne(id: string, data: T): Promise<T>;
	deleteMany(ids: string[]): Promise<void>;
	deleteOne(id: string): Promise<void>;
}
