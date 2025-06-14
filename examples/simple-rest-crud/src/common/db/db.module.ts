import { AModule } from '@boong/core';
import { container } from 'tsyringe';
import { DI } from '../types/di';
import { dataSource } from './connect';

export class DBModule extends AModule {
	static register() {
		container.register(DI.DataSource, { useValue: dataSource });
	}
}
