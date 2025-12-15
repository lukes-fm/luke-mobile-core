export type SNTableAPIDeleteParams = {
	sysparm_query_no_domain?: boolean;
};

export type SNTableAPIDefaultParams = {
	sysparm_display_value?: 'true' | 'false' | 'all';
	sysparm_fields?: string;
	sysparm_view?: string;
} & SNTableAPIDeleteParams;

export type SNTableAPIPatchParams = {
	sysparm_input_display_value?: boolean;
} & SNTableAPIDefaultParams;

export type SNTableAPIGetParams = {
	sysparm_exclude_reference_link?: boolean;
} & SNTableAPIDefaultParams;

export type SNTableAPIRecordsParams = {
	sysparm_limit?: number;
	sysparm_no_count?: boolean;
	sysparm_offset?: number;
	sysparm_query?: string;
	sysparm_query_category?: string;
	sysparm_suppress_pagination_header?: boolean;
	sysparm_view?: 'desktop' | 'mobile' | 'both';
} & SNTableAPIGetParams;

export type SNTableAPIPostParams = SNTableAPIPatchParams & SNTableAPIGetParams;
export type SNTableAPIPutParams = SNTableAPIPatchParams & SNTableAPIGetParams;
