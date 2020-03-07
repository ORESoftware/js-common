
export namespace cp_tables {

	export interface cp_users {
		id: string
		email: string
		name: string
		language: string
		api_key: string
		verified: boolean
		age: number
		first_name: any
		last_name: any
		birth_date: string
		updated_at: any
		created_at: any
	}

	export namespace cp_users_fields {
		 export type id = string;
		 export type email = string;
		 export type name = string;
		 export type language = string;
		 export type api_key = string;
		 export type verified = boolean;
		 export type age = number;
		 export type first_name = any;
		 export type last_name = any;
		 export type birth_date = string;
		 export type updated_at = any;
		 export type created_at = any;
	}

	export interface cp_users_auth {
		id: string
		user_id: string
		auth_method: string
		auth_value: any
		created_at: any
		updated_at: any
	}

	export namespace cp_users_auth_fields {
		 export type id = string;
		 export type user_id = string;
		 export type auth_method = string;
		 export type auth_value = any;
		 export type created_at = any;
		 export type updated_at = any;
	}

	export interface cp_user_emails {
		id: string
		user_id: string
		email: string
		created_at: any
		updated_at: any
	}

	export namespace cp_user_emails_fields {
		 export type id = string;
		 export type user_id = string;
		 export type email = string;
		 export type created_at = any;
		 export type updated_at = any;
	}

}
