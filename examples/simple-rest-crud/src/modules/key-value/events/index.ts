import { IEvent } from '@boong/core';

export interface KeyValueCreated extends IEvent {
	payload: {
		key: string;
		value: string;
	};
}

export interface KeyValueUpdated extends IEvent {
	payload: {
		key: string;
		value: string;
	};
}

export interface KeyValueDeleted extends IEvent {
	payload: {
		key: string;
	};
}

export interface KeyValueBulkCreated extends IEvent {
	payload: {
		key: string;
		value: string;
	}[];
}

export interface KeyValueBulkUpdated extends IEvent {
	payload: {
		key: string;
		value: string;
	}[];
}

export interface KeyValueBulkDeleted extends IEvent {
	payload: {
		key: string;
	}[];
}
