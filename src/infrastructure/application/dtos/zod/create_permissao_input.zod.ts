import { z } from 'zod';
import { PermissaoConstraintZod } from './literals/permissao_constraint.zod';

export const CreatePermissaoInputZod = z.object({
  descricao: z.string(),
  acao: z.string(),
  recurso: z.string(),
  constraint: PermissaoConstraintZod,
});
