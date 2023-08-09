import { z } from 'zod';
import { IdZod } from './literals/id.zod';

export const FindUsuarioCargoByUsuarioIdAndCargoIdInputZod = z.object({
  usuarioId: IdZod,
  cargoId: IdZod,
});
