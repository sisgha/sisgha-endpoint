import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import {
  PeriodoDiaHoraIntervaloZod,
  refinePeriodoDiaHoraIntervalo,
} from '../interfaces/PeriodoDiaIntervalo';
import { CreatePeriodoDiaInputBaseZod } from './CreatePeriodoDiaInput';
import { FindPeriodoDiaByIdInputZod } from './FindPeriodoDiaByIdInput';

export const UpdatePeriodoDiaInputZod = z
  .object({})
  .merge(FindPeriodoDiaByIdInputZod)
  .merge(CreatePeriodoDiaInputBaseZod.partial())
  .merge(PeriodoDiaHoraIntervaloZod.partial())
  .superRefine(refinePeriodoDiaHoraIntervalo);

export type IUpdatePeriodoDiaInput = z.infer<typeof UpdatePeriodoDiaInputZod>;

@InputType('UpdatePeriodoDiaInput')
export class UpdatePeriodoDiaInputType implements IUpdatePeriodoDiaInput {
  @Field(() => Int)
  id!: number;

  @Field(() => String, { nullable: true })
  horaInicio?: string;

  @Field(() => String, { nullable: true })
  horaFim?: string;
}
