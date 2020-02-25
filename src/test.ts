import {cp_tables} from "./read-only/types";

type CPUsersAuth = cp_tables.cp_users;

type CPUsersId = cp_tables.cp_users_fields.id;


const v: CPUsersAuth = {
  age: 0,
  api_key: "",
  created: undefined,
  email: "",
  id: "",
  language: "",
  name: "",
  verified: false
};
