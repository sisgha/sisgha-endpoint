import { ICheckUsuarioAuthorizationsInputCheck } from './ICheckUsuarioAuthorizationsInput';

export type ICheckUsuarioAuthorizationsResultCheck = ICheckUsuarioAuthorizationsInputCheck & {
  can: boolean;
};

export type ICheckUsuarioAuthorizationsResult = {
  checks: ICheckUsuarioAuthorizationsResultCheck[];
};
