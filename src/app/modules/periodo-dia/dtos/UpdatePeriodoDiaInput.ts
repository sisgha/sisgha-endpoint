import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { FindPeriodoDiaByIdInputZod } from './FindPeriodoDiaByIdInput';
import {
  PeriodoDiaIntervaloZod,
  refinePeriodoDiaIntervalo,
} from './PeriodoDiaIntervaloZod';

export const UpdatePeriodoDiaInputZod = z
  .object({})
  .merge(FindPeriodoDiaByIdInputZod)
  .merge(PeriodoDiaIntervaloZod)
  .superRefine(refinePeriodoDiaIntervalo);

export type IUpdatePeriodoDiaInput = z.infer<typeof UpdatePeriodoDiaInputZod>;

@InputType('UpdatePeriodoDiaInput')
export class UpdatePeriodoDiaInputType implements IUpdatePeriodoDiaInput {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  horaInicio!: string;

  @Field(() => String)
  horaFim!: string;
}
