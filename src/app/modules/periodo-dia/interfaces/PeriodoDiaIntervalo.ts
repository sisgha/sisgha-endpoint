import { parseTimeTz, TimetzZod } from 'src/infrastructure/zod/TimetzZod';
import { RefinementCtx, z } from 'zod';

export const PeriodoDiaHoraIntervaloZod = z.object({
  horaInicio: TimetzZod,
  horaFim: TimetzZod,
});

type IPeriodoDiaHoraIntervaloZodOutput = z.output<
  typeof PeriodoDiaHoraIntervaloZod
>;

export type IPeriodoDiaHoraIntervalo = z.infer<
  typeof PeriodoDiaHoraIntervaloZod
>;

export const refinePeriodoDiaHoraIntervalo = <
  T extends Partial<IPeriodoDiaHoraIntervaloZodOutput>,
>(
  val: T,
  ctx: RefinementCtx,
) => {
  const { horaInicio, horaFim } = val;

  if (horaInicio || horaFim) {
    if (horaInicio && horaFim) {
      const inicio = parseTimeTz(horaInicio);
      const fim = parseTimeTz(horaFim);

      if (inicio.asDate >= fim.asDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Hora de início deve ser menor que hora de fim',
        });
      }
    } else {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Forneca a hora de início e hora de fim.',
      });
    }
  }
};
