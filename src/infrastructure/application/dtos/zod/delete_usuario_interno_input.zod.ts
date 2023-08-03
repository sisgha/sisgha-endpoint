import { FindUsuarioInternoByIdInputZod } from './find_usuario_interno_by_id_input.zod';

export const DeleteUsuarioInternoInputZod = FindUsuarioInternoByIdInputZod.pick({
  id: true,
});
