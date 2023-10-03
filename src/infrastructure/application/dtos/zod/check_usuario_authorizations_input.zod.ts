import { z } from 'zod';
import { IdZod } from './literals';
import { AppAuthorizationRecurso } from './literals/AppAuthorizationRecurso';
import { AppAuthorizationVerbo } from './literals/AppAuthorizationVerbo';

export const CheckUsuarioAuthorizationsInputZodCheck = z.object({
  usuarioId: IdZod,

  recurso: AppAuthorizationRecurso,
  verbo: AppAuthorizationVerbo,

  entityId: IdZod.nullable().default(null),
});

export const CheckUsuarioAuthorizationsInputZod = z.object({
  checks: z.array(CheckUsuarioAuthorizationsInputZodCheck).max(100),
});
