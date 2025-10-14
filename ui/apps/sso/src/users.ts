// To parse this data:
//
//   import { Convert, Welcome } from "./file";
//
//   const welcome = Convert.toWelcome(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Users {
  data: User[];
  pages: number;
}

export interface User {
  id: number;
  username: string;
  auth_id: string;
  roles: null;
  delegations: Delegation[];
  delegationsSent: Delegation[];
  userOffices: UserOffice[];
  storicUserOffices: UserOffice[];
}

export interface Delegation {
  id: number;
  note: string;
  user_id: number;
  from_user_id: number;
  delegation_start: Date;
  delegation_end: Date;
  attachment: Attachment;
  permits: Permit[];
  fromUser_UserName: Name;
  user_UserName: string;
}

export interface Attachment {
  id: number;
  url: string;
  delegation_id: number;
}

export enum Name {
  Approvatorientrata = 'approvatorientrata',
  Approvatorispesa1 = 'approvatorispesa1',
  Approvatorispesa2 = 'approvatorispesa2',
  Controllobeniservizi = 'controllobeniservizi',
  Controllobilancio = 'controllobilancio',
  Controllofiscale = 'controllofiscale',
  Controllomutuo = 'controllomutuo',
  Controlloopere = 'controlloopere',
  Controllopartecipate = 'controllopartecipate',
  Controllopatrimonio = 'controllopatrimonio',
  Controllopeg = 'controllopeg',
  Direttore = 'direttore',
  Dirigente = 'dirigente',
  Dirigentespesa = 'dirigentespesa',
  Dirigentespesa1 = 'dirigentespesa1',
  Dirigentespesa2 = 'dirigentespesa2',
  Ragioniere = 'ragioniere',
  Ragionieregenerale = 'ragionieregenerale',
  Ragionierespesa1 = 'ragionierespesa1',
  Ragionierespesa2 = 'ragionierespesa2',
  Redattore = 'redattore',
  Responsabileprocedimento = 'responsabileprocedimento',
  Sbloccabilancio = 'sbloccabilancio'
}

export interface Permit {
  id: number;
  father_permit_id: number | null;
  delegation_id: number | null;
  user_id: number;
  office_id: number;
  role_id: number;
  type: Type;
  father: Permit | null;
  officeName: string;
  role: Role;
}

export interface Role {
  id: number;
  name: Name;
  full_name: FullName;
  keycloak_ref: string;
  hierarchy_level: number;
}

export enum FullName {
  Controllobeniservizi = 'controllobeniservizi',
  Controllobilancio = 'controllobilancio',
  Controlloopere = 'controlloopere',
  Controllopeg = 'controllopeg',
  Dirigentespesa1 = 'dirigentespesa1',
  Dirigentespesa2 = 'dirigentespesa2',
  Ragionierespesa1 = 'ragionierespesa1',
  Ragionierespesa2 = 'ragionierespesa2',
  Sbloccabilancio = 'sbloccabilancio',
  TestAppApprovatorientrata = 'testApp_approvatorientrata',
  TestAppApprovatorispesa1 = 'testApp_approvatorispesa1',
  TestAppApprovatorispesa2 = 'testApp_approvatorispesa2',
  TestAppControllofiscale = 'testApp_controllofiscale',
  TestAppControllomutuo = 'testApp_controllomutuo',
  TestAppControllopartecipate = 'testApp_controllopartecipate',
  TestAppControllopatrimonio = 'testApp_controllopatrimonio',
  TestAppDirettore = 'testApp_direttore',
  TestAppDirigente = 'testApp_dirigente',
  TestAppDirigentespesa = 'testApp_dirigentespesa',
  TestAppRagioniere = 'testApp_ragioniere',
  TestAppRagionieregenerale = 'testApp_ragionieregenerale',
  TestAppRedattore = 'testApp_redattore',
  TestAppResponsabileprocedimento = 'testApp_responsabileprocedimento'
}

export enum Type {
  Delegation = 'DELEGATION',
  Persistent = 'PERSISTENT'
}

export interface UserOffice {
  id: number | null;
  user_id: number;
  office_id: number;
  deleted: boolean;
  roles: Role[];
  office: Office | null;
  userOfficeRoles: Permit[];
  userOfficeDelegheInviate: Permit[];
}

export interface Office {
  id: number;
  name: string;
  code: string;
  description: null | string;
  dirigente_user_id: null;
  office_start_date: Date | null;
  office_end_date: Date | null;
  last_update: Date | null;
  deleted: boolean;
}
