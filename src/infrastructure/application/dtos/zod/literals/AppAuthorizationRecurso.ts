import { z } from 'zod';

export const AppAuthorizationRecurso = z.string().trim().min(1);
