import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';
import {
  PeriodoDiaHoraIntervaloZod,
  refinePeriodoDiaHoraIntervalo,
} from '../interfaces/PeriodoDiaIntervalo';

export const CreatePeriodoDiaInputBaseZod = z.object({});

export const CreatePeriodoDiaInputZod = CreatePeriodoDiaInputBaseZod.extend({})
  .merge(PeriodoDiaHoraIntervaloZod)
  .superRefine(refinePeriodoDiaHoraIntervalo);

export type ICreatePeriodoDiaInput = z.infer<typeof CreatePeriodoDiaInputZod>;

@InputType('CreatePeriodoDiaInput')
export class CreatePeriodoDiaInputType implements ICreatePeriodoDiaInput {
  @Field(() => String)
  horaInicio!: string;

  @Field(() => String)
  horaFim!: string;
}
