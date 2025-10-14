// To parse this data:
//
//   import { Convert, Welcome } from "./file";
//
//   const welcome = Convert.toWelcome(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Data {
  data: any[];
  pages: number;
}

export interface User {
  id: number;
  username: string;
  auth_id: string;
  roles: null;
  userOffices: UserOffice[];
}

export interface UserOffice {
  id: number;
  user_id: number;
  office_id: number;
  roles: Role[];
  userOfficeRoles: UserOfficeRole[];
  office: Office;
  userOfficeDelegheInviate: UserOfficeRole[];
}

export interface Office {
  id: number;
  name: string;
  code: string;
  description: string;
  dirigente_user_id: null;
  start: null;
  end: null;
  last_update: null;
  deleted: boolean;
}

export interface Role {
  id: number;
  name: string;
  full_name: string;
  keycloak_ref: string;
  hierarchy_level: number;
}

export interface UserOfficeRole {
  id: number;
  father_permit_id: number | null;
  note: null | string;
  user_id: number;
  office_id: number;
  role_id: number;
  delegation_start: Date | null;
  delegation_end: Date | null;
  type: string;
  role: Role;
  father: UserOfficeRole | null;
  attachments: any[] | null;
}
