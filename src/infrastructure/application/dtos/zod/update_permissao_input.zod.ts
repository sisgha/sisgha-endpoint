import { z } from 'zod';
import { FindPermissaoByIdInputZod } from './find_permissao_by_id_input.zod';
import { CreatePermissaoInputZod } from './create_permissao_input.zod';

export const UpdatePermissaoInputZod = z
  .object({})
  .merge(FindPermissaoByIdInputZod)
  .merge(
    CreatePermissaoInputZod.pick({
      descricao: true,
      acao: true,
      recurso: true,
      constraint: true,
    }).partial(),
  );
