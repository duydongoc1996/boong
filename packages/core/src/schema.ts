export type TSchema = {
	name: string;
	single_name: string;
	plural_name: string;
	fields: {
		[field: string]: TField;
	};
	indexes: {}; // TODO
	relations: {}; // TODO
};

export type EFieldType = 'string' | 'number' | 'boolean' | 'date';

export type TIDField = {
	type: 'number' | 'string';
	generator: 'uuid' | 'increment';
};

export type TStringField = {
	type: 'string';
	required: boolean;
	unique: boolean;
	validator: (value: string) => boolean;
};

export type TNumberField = {
	type: 'number';
	required: boolean;
	unique: boolean;
	validator: (value: number) => boolean;
};

export type TBooleanField = {
	type: 'boolean';
	required: boolean;
	unique: boolean;
	validator: (value: boolean) => boolean;
};

export type TDateField = {
	type: 'date';
	required: boolean;
	unique: boolean;
	validator: (value: Date) => boolean;
};

export type TField = TIDField | TStringField | TNumberField | TBooleanField | TDateField;
