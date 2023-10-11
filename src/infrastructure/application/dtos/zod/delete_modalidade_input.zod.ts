import { FindModalidadeByIdInputZod } from './find_modalidade_by_id_input.zod';

export const DeleteModalidadeInputZod = FindModalidadeByIdInputZod.pick({
  id: true,
});
