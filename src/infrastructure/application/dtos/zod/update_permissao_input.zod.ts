import { z } from 'zod';
import { CreatePermissaoInputZod } from './create_permissao_input.zod';
import { FindPermissaoByIdInputZod } from './find_permissao_by_id_input.zod';

export const UpdatePermissaoInputZod = z
  .object({})
  .merge(FindPermissaoByIdInputZod)
  .merge(
    CreatePermissaoInputZod.pick({
      descricao: true,

      verboGlobal: true,
      verbos: true,

      recursoGlobal: true,
      recursos: true,

      authorizationConstraintRecipe: true,
    }).partial(),
  );
