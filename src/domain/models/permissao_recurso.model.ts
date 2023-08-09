import { PermissaoModel } from './permissao.model';

export interface PermissaoRecursoModel {
  id: number;

  // ...

  recurso: string;

  // ...

  permissaoId: PermissaoModel['id'];
}
