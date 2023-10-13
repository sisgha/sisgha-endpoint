import { FindCursoByIdInputZod } from './find_curso_by_id_input.zod';

export const DeleteCursoInputZod = FindCursoByIdInputZod.pick({
  id: true,
});
