import { z } from 'zod';

const msg = 'Deve ser um ID válido.';

export const IdZod = z.number().int(msg).gt(0, msg);
