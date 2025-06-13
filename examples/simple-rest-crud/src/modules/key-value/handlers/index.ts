import { KeyValue } from '../entities/key-value';
import { keyValueRepository } from '../repositories';

export default {
	findOne: async (id: string) => {
		const result = await keyValueRepository.findOne({ query: { id } });
		return result;
	},
	findMany: async () => {
		const result = await keyValueRepository.findMany({ query: {} });
		return result;
	},
	createOne: async (data: KeyValue) => {
		const result = await keyValueRepository.createOne({ data });
		return result;
	},
	createMany: async (data: KeyValue[]) => {
		const result = await keyValueRepository.createMany({ data });
		return result;
	},
	updateOne: async (id: string, data: KeyValue) => {
		const result = await keyValueRepository.updateOne({ query: { id }, data });
		return result;
	},
	updateMany: async (data: KeyValue[]) => {
		const result = await keyValueRepository.updateMany({ query: {}, data });
		return result;
	},
	deleteOne: async (id: string) => {
		const result = await keyValueRepository.deleteOne({ query: { id } });
		return result;
	},
	deleteMany: async (ids: string[]) => {
		const result = await keyValueRepository.deleteMany({ query: { id: ids } });
		return result;
	},
};
