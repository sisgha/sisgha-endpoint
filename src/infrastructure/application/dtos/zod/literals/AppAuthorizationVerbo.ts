import { z } from 'zod';

export const AppAuthorizationVerbo = z.string().trim().min(1);
