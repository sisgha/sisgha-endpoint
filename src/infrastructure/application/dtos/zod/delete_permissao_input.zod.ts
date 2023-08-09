import { FindPermissaoByIdInputZod } from './find_permissao_by_id_input.zod';

export const DeletePermissaoInputZod = FindPermissaoByIdInputZod.pick({
  id: true,
});
