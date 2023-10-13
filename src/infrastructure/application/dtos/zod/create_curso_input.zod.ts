import { z } from 'zod';
import { FindModalidadeByIdInputZod } from './find_modalidade_by_id_input.zod';

export const CreateCursoInputZod = z.object({
  nome: z.string().trim().min(1),
  nomeAbreviado: z.string().trim().min(1),

  modalidadeId: FindModalidadeByIdInputZod.shape.id,
});
