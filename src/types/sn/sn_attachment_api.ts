export type SNAttachmentAPIGetParams = {
	sysparm_limit?: number;
	sysparm_offset?: number;
	sysparm_query?: string;
};

export type SNAttachmentAPIPostParams = {
	creation_time?: string;
	encryption_context?: string;
};
