import { z } from 'zod';
import { CreateModalidadeInputZod } from './create_modalidade_input.zod';
import { FindModalidadeByIdInputZod } from './find_modalidade_by_id_input.zod';

export const UpdateModalidadeInputZod = z
  .object({})
  .merge(FindModalidadeByIdInputZod)
  .merge(
    CreateModalidadeInputZod.pick({
      slug: true,
      nome: true,
    }).partial(),
  );
