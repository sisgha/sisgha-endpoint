import { z } from 'zod';
import { FindCargoByIdInputZod } from './find_cargo_by_id_input.zod';
import { CreateCargoInputZod } from './create_cargo_input.zod';

export const UpdateCargoInputZod = z
  .object({})
  .merge(FindCargoByIdInputZod)
  .merge(
    CreateCargoInputZod.pick({
      slug: true,
    }).partial(),
  );
