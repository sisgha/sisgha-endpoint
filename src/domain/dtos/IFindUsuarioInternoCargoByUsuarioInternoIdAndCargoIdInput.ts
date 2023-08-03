import { z } from 'zod';
import { FindUsuarioInternoCargoByUsuarioInternoIdAndCargoIdInputZod } from '../../infrastructure/application/dtos/zod/find_usuario_interno_cargo_by_usuario_interno_id_and_cargo_id_input.zod';

export type IFindUsuarioInternoCargoByUsuarioInternoIdAndCargoIdInput = z.infer<
  typeof FindUsuarioInternoCargoByUsuarioInternoIdAndCargoIdInputZod
>;
