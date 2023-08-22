import { z } from 'zod';
import { FindUsuarioByIdInputZod } from './find_usuario_by_id_input.zod';

export const UpdateUsuarioPasswordInputZod = z
  .object({})
  .merge(FindUsuarioByIdInputZod)
  .merge(
    z.object({
      currentPassword: z.string(),
      newPassword: z.string(),
      confirmNewPassword: z.string(),
    }),
  )
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ['confirmNewPassword'],
  });
