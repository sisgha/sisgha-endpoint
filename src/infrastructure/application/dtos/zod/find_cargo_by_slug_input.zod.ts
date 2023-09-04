import { z } from 'zod';
import { CreateCargoInputZod } from './create_cargo_input.zod';

export const FindCargoBySlugInputZod = z.object({
  slug: CreateCargoInputZod.shape.slug,
});
