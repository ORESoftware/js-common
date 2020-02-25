
export namespace cp_tables {

	export interface cp_users {
		id: string
		created: any
		email: string
		name: string
		language: string
		api_key: string
		verified: boolean
		age: number
	}
	export namespace cp_users_fields {
		 export type id = string;
		 export type created = any;
		 export type email = string;
		 export type name = string;
		 export type language = string;
		 export type api_key = string;
		 export type verified = boolean;
		 export type age = number;
	}

	export interface cp_users_auth {
		id: string
		user_id: string
		auth_method: string
		auth_value: any
	}
	export namespace cp_users_auth_fields {
		 export type id = string;
		 export type user_id = string;
		 export type auth_method = string;
		 export type auth_value = any;
	}

}
