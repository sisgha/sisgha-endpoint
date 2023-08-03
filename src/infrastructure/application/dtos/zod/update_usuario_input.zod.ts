import { z } from 'zod';
import { FindUsuarioByIdInputZod } from './find_usuario_by_id_input.zod';
import { CreateUsuarioInputZod } from './create_usuario_input.zod';

export const UpdateUsuarioInputZod = z
  .object({})
  .merge(FindUsuarioByIdInputZod)
  .merge(
    CreateUsuarioInputZod.pick({
      email: true,
      matriculaSiape: true,
    }).partial(),
  );
