import { isDate } from 'lodash';
import { RefinementCtx, z } from 'zod';

export const SemanaDataIntervaloZod = z.object({
  dataInicio: z.coerce.date(),
  dataFim: z.coerce.date(),
});

type ISemanaDataIntervaloZodOutput = z.output<typeof SemanaDataIntervaloZod>;

export type ISemanaDataIntervalo = z.infer<typeof SemanaDataIntervaloZod>;

export const refineSemanaDataIntervalo = <
  T extends Partial<ISemanaDataIntervaloZodOutput>,
>(
  val: T,
  ctx: RefinementCtx,
) => {
  const { dataFim, dataInicio } = val;

  if (dataInicio || dataFim) {
    if (isDate(dataInicio) && isDate(dataFim)) {
      if (dataInicio >= dataFim) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Data de início deve ser menor que a data de fim.',
        });
      }
    } else {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Forneca a data de início e data de fim.',
      });
    }
  }
};
