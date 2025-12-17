export * from './sn_config';
export * from './sn_data';
export * from './sn_table_api';
export * from './sn_attachment_api';

export type SNGlideDateTime = string;

// TODO: Understanding of how data will come is required.
// Should all keys other than sys be label value pairs, storage limitations are the concern?
export type SNLabelValue = { label: string; value: string };

export type SNSystemRecord = {
	sys_id: string;
	sys_created_on: SNGlideDateTime;
	sys_created_by: string;
	sys_mod_count: number;
	sys_updated_on: SNGlideDateTime;
	sys_updated_by: string;
};

export type SNRecord = { [key: string]: SNLabelValue } & SNSystemRecord;
