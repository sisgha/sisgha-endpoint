import { Field, InputType, Int } from '@nestjs/graphql';
import { SemanaStatus } from 'src/app/modules/semana/interfaces/SemanaStatus';
import { z } from 'zod';
import {
  refineSemanaDataIntervalo,
  SemanaDataIntervaloZod,
} from '../interfaces/SemanaDataIntervalo';
import { CreateSemanaInputBaseZod } from './CreateSemanaInput';
import { FindSemanaByIdInputZod } from './FindSemanaByIdInput';

export const UpdateSemanaInputZod = z
  .object({})
  .merge(FindSemanaByIdInputZod)
  .merge(CreateSemanaInputBaseZod.partial())
  .merge(SemanaDataIntervaloZod.partial())
  .superRefine(refineSemanaDataIntervalo);

export type IUpdateSemanaInput = z.infer<typeof UpdateSemanaInputZod>;

@InputType('UpdateSemanaInput')
export class UpdateSemanaInputType implements IUpdateSemanaInput {
  @Field(() => Int)
  id!: number;

  @Field(() => Date, { nullable: true })
  dataInicio?: Date;

  @Field(() => Date, { nullable: true })
  dataFim?: Date;

  @Field(() => String, { nullable: true })
  status?: SemanaStatus;
}
