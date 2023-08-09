import { FindUsuarioByIdInputZod } from './find_usuario_by_id_input.zod';

export const DeleteUsuarioInputZod = FindUsuarioByIdInputZod.pick({
  id: true,
});
