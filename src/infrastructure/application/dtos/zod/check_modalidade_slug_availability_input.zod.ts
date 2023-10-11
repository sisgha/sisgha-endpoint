import { z } from 'zod';
import { CreateModalidadeInputZod } from './create_modalidade_input.zod';
import { FindModalidadeByIdInputZod } from './find_modalidade_by_id_input.zod';

export const CheckModalidadeSlugAvailabilityInputZod = z.object({
  modalidadeId: FindModalidadeByIdInputZod.shape.id.nullable().default(null),
  slug: CreateModalidadeInputZod.shape.slug,
});
