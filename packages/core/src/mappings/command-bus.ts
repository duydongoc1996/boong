import { CreateKeyValueCommandHandler } from '@/domains/key-value/2-usecases/key-value/create.handler';
import { UpdateKeyValueCommandHandler } from '@/domains/key-value/2-usecases/key-value/update.handler';
import {
	CreateKeyValueCommand,
	UpdateKeyValueCommand,
} from '@/domains/key-value/commands/key-value.command';
import { CqrsPluginParams } from '@boong/cqrs';

const commandBus: CqrsPluginParams['commands'] = [
	[CreateKeyValueCommand, new CreateKeyValueCommandHandler()],
	[UpdateKeyValueCommand, new UpdateKeyValueCommandHandler()],
];

export { commandBus };
