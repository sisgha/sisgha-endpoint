import { z } from 'zod';
import { CreateCargoInputZod } from './create_cargo_input.zod';
import { FindCargoByIdInputZod } from './find_cargo_by_id_input.zod';

export const CheckCargoSlugAvailabilityInputZod = z.object({
  cargoId: FindCargoByIdInputZod.shape.id.nullable().default(null),
  slug: CreateCargoInputZod.shape.slug,
});
