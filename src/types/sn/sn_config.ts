// TODO: Unsure where this should all sit.
export type Checksum = {
	checksum: number;
};

export type ChecksumData<T> = Checksum & {
	data: T;
};

export type SNApp = {
	id: string;
	tables: SNTable[];
	lists: SNList[];
	forms: SNForm[];
	recordProducers: SNRecordProducer[];
};

export type SNTable = {
	name: string;
	label: string;
	fields: SNField[];
};

export type SNField = {
	sysId: string;
	label: string;
	name: string;
	table: string;
	type: SNFieldType;
};

export type SNForm = {
	sysId: string;
	label: string;
	sections: SNSection[];
};

export type SNSection = {
	sysId: string;
	name: string;
	elements: SNElement[];
};

export type SNList = {
	sysId: string;
	label: string;
	elements: SNElement[];
};

export type SNElement = {
	sysId: string;
	element: string;
	position: number;
	type: string;
	internalType: string;
};

export type SNFieldType = 'integer' | 'choice' | ''; // ...

export type SNRecordProducer = {
	sysId: string;
};
