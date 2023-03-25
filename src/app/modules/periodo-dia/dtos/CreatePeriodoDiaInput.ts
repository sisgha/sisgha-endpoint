import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';
import {
  PeriodoDiaIntervaloZod,
  refinePeriodoDiaIntervalo,
} from './PeriodoDiaIntervaloZod';

export const CreatePeriodoDiaInputZod = z
  .object({})
  .merge(PeriodoDiaIntervaloZod)
  .superRefine(refinePeriodoDiaIntervalo);

export type ICreatePeriodoDiaInput = z.infer<typeof CreatePeriodoDiaInputZod>;

@InputType('CreatePeriodoDiaInput')
export class CreatePeriodoDiaInputType implements ICreatePeriodoDiaInput {
  @Field(() => String)
  horaInicio!: string;

  @Field(() => String)
  horaFim!: string;
}
