import { z } from 'zod';
import { IdZod } from './literals/id.zod';

export const AddCargoToUsuarioInputZod = z.object({
  cargoId: IdZod,
  usuarioId: IdZod,
});
