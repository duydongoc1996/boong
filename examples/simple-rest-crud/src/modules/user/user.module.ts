import { AModule, CORE_DI } from '@boong/core';
import { container } from 'tsyringe';
import { DI } from '../../common/types/di';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

export class UserModule extends AModule {
	static register() {
		// Register dependencies
		container.register(DI.UserRepository, { useClass: UserRepository });
		container.register(DI.UserService, { useClass: UserService });
		container.register(DI.UserController, { useClass: UserController });

		// Register as app controller
		container.register(CORE_DI.Controller, { useClass: UserController });
	}
}
