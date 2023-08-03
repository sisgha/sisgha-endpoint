import { FindCargoByIdInputZod } from './find_cargo_by_id_input.zod';

export const DeleteCargoInputZod = FindCargoByIdInputZod.pick({
  id: true,
});
