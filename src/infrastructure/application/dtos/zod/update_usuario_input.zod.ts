import { z } from 'zod';
import { CreateUsuarioInputZod } from './create_usuario_input.zod';
import { FindUsuarioByIdInputZod } from './find_usuario_by_id_input.zod';

export const UpdateUsuarioInputZod = z
  .object({})
  .merge(FindUsuarioByIdInputZod)
  .merge(
    CreateUsuarioInputZod.pick({
      nome: true,
      email: true,
      matriculaSiape: true,
    }).partial(),
  );
