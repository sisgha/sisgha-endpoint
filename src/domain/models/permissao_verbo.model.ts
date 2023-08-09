import { PermissaoModel } from './permissao.model';

export interface PermissaoVerboModel {
  id: number;

  // ...

  verbo: string;

  // ...

  permissaoId: PermissaoModel['id'];
}
