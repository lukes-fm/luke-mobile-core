export type SNAttachmentAPIGetParams = {
	sysparm_limit?: number;
	sysparm_offset?: number;
	sysparm_query?: string;
};

export type SNAttachmentAPIPostParams = {
	file_name: string;
	table_name: string;
	table_sys_id: string;
	creation_time?: string;
	encryption_context?: string;
};
