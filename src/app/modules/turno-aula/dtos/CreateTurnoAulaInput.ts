import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/common/zod/IdZod';
import { z } from 'zod';

export const CreateTurnoAulaInputZod = z.object({
  diaSemanaId: IdZod,
  periodoDiaId: IdZod,
});

export type ICreateTurnoAulaInput = z.infer<typeof CreateTurnoAulaInputZod>;

@InputType('CreateTurnoAulaInput')
export class CreateTurnoAulaInputType implements ICreateTurnoAulaInput {
  @Field(() => Int)
  diaSemanaId!: number;

  @Field(() => Int)
  periodoDiaId!: number;
}
