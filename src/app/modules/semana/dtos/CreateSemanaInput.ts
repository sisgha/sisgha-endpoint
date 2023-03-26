import { Field, InputType } from '@nestjs/graphql';
import {
  SemanaStatus,
  SemanaStatusZod,
} from 'src/app/modules/semana/interfaces/SemanaStatus';
import { z } from 'zod';
import {
  refineSemanaDataIntervalo,
  SemanaDataIntervaloZod,
} from '../interfaces/SemanaDataIntervalo';

export const CreateSemanaInputBaseZod = z.object({
  status: SemanaStatusZod.default(SemanaStatus.RASCUNHO),
});

export const CreateSemanaInputZod = CreateSemanaInputBaseZod.extend({})
  .merge(SemanaDataIntervaloZod)
  .superRefine(refineSemanaDataIntervalo);

export type ICreateSemanaInput = z.infer<typeof CreateSemanaInputZod>;

@InputType('CreateSemanaInput')
export class CreateSemanaInputType implements ICreateSemanaInput {
  @Field(() => Date)
  dataInicio!: Date;

  @Field(() => Date)
  dataFim!: Date;

  @Field(() => String, { nullable: true })
  status!: SemanaStatus;
}
