import { z } from 'zod';
import { CreateUsuarioInputZod } from './create_usuario_input.zod';
import { FindUsuarioByIdInputZod } from './find_usuario_by_id_input.zod';

export const CheckUsuarioMatriculaSiapeAvailabilityInputZod = z.object({
  usuarioId: FindUsuarioByIdInputZod.shape.id.nullable().default(null),
  matriculaSiape: CreateUsuarioInputZod.shape.matriculaSiape,
});
