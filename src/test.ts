import {cp_tables} from "./read-only/types";

type CPUsersAuth = cp_tables.cp_users;

type CPUsersId = cp_tables.cp_users_fields.id;


const v: CPUsersAuth = {
  birth_date: "",
  first_name: undefined,
  last_name: undefined,
  updated_at: undefined,
  age: 0,
  api_key: "",
  created_at: null,
  email: "",
  id: "",
  language: "",
  name: "",
  verified: false
};
