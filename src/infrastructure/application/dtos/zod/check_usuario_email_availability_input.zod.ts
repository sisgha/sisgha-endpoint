import { z } from 'zod';
import { CreateUsuarioInputZod } from './create_usuario_input.zod';
import { FindUsuarioByIdInputZod } from './find_usuario_by_id_input.zod';

export const CheckUsuarioEmailAvailabilityInputZod = z.object({
  usuarioId: FindUsuarioByIdInputZod.shape.id.nullable().default(null),
  email: CreateUsuarioInputZod.shape.email,
});
