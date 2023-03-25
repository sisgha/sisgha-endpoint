import { parseTimeTz, TimetzZod } from 'src/infrastructure/zod/TimetzZod';
import { RefinementCtx, z } from 'zod';

export const PeriodoDiaIntervaloZod = z.object({
  horaInicio: TimetzZod,
  horaFim: TimetzZod,
});

type Output = z.output<typeof PeriodoDiaIntervaloZod>;

export type IPeriodoDiaIntervalo = z.infer<typeof PeriodoDiaIntervaloZod>;

export const refinePeriodoDiaIntervalo = <T extends Output>(
  val: T,
  ctx: RefinementCtx,
) => {
  const inicio = parseTimeTz(val.horaInicio);
  const fim = parseTimeTz(val.horaFim);

  if (inicio.asDate >= fim.asDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Hora de início deve ser menor que hora de fim',
    });
  }
};
