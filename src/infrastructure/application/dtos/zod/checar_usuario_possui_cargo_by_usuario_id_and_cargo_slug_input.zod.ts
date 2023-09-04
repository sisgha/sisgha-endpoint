import { z } from 'zod';
import { FindCargoBySlugInputZod } from './find_cargo_by_slug_input.zod';
import { FindUsuarioByIdInputZod } from './find_usuario_by_id_input.zod';

export const ChecarUsuarioPossuiCargoByUsuarioIdAndCargoSlugInputZod = z.object({
  usuarioId: FindUsuarioByIdInputZod.shape.id,
  cargoSlug: FindCargoBySlugInputZod.shape.slug,
});
