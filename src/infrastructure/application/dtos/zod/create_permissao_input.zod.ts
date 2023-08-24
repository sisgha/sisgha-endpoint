import { z } from 'zod';
import { CASL_RECURSO_WILDCARD } from '../../../actor-context/interfaces/CASL_RECURSO_WILDCARD';
import { CASL_VERBO_WILDCARD } from '../../../actor-context/interfaces/CASL_VERBO_WILDCARD';
import { AuthorizationConstraintRecipeZod } from '../../../authorization/zod';

export const CreatePermissaoInputZod = z.object({
  descricao: z.string(),

  verboGlobal: z.boolean().default(false),

  verbos: z.array(z.string().refine((v) => v !== CASL_VERBO_WILDCARD, { message: 'verbos não pode conter o valor CASL_VERBO_WILDCARD' })),

  recursoGlobal: z.boolean().default(false),

  recursos: z.array(
    z.string().refine((v) => v !== CASL_RECURSO_WILDCARD, { message: 'recursos não pode conter o valor CASL_RECURSO_WILDCARD' }),
  ),

  authorizationConstraintRecipe: AuthorizationConstraintRecipeZod,
});
