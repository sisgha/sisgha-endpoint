import { z } from 'zod';
import { FindUsuarioInternoByIdInputZod } from './find_usuario_interno_by_id_input.zod';
import { CreateUsuarioInternoInputZod } from './create_usuario_interno_input.zod';

export const UpdateUsuarioInternoInputZod = z
  .object({})
  .merge(FindUsuarioInternoByIdInputZod)
  .merge(
    CreateUsuarioInternoInputZod.pick({
      tipoEntidade: true,
    }).partial(),
  );
