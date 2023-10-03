import { IFindUsuarioByIdInput } from './IFindUsuarioByIdInput';

export type ICheckUsuarioAuthorizationsInputCheck = {
  usuarioId: IFindUsuarioByIdInput['id'];

  recurso: string;
  verbo: string;

  entityId: number | null;
};

export type ICheckUsuarioAuthorizationsInput = {
  checks: ICheckUsuarioAuthorizationsInputCheck[];
};
