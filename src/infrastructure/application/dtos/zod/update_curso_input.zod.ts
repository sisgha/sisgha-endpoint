import { z } from 'zod';
import { CreateCursoInputZod } from './create_curso_input.zod';
import { FindCursoByIdInputZod } from './find_curso_by_id_input.zod';

export const UpdateCursoInputZod = z
  .object({})
  .merge(FindCursoByIdInputZod)
  .merge(
    CreateCursoInputZod.pick({
      nome: true,
      nomeAbreviado: true,
      modalidadeId: true,
    }).partial(),
  );
