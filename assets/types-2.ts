
export namespace cp_tables {

  export namespace cp_users_fields {
    export type id = number;
    export type handle = string;
    export type email = string;
    export type first_name = string;
    export type last_name = string;
    export type is_verified = boolean;
  }

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

  export interface cp_users_auth {
    id: string
    user_id: string
    auth_method: string
    auth_value: any
  }

}

type c = cp_tables.cp_users_fields.id
