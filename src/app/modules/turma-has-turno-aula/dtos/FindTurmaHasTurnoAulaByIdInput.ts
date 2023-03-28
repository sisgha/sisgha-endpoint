import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/infrastructure/zod/IdZod';
import { z } from 'zod';

export const FindTurmaHasTurnoAulaByIdInputZod = z.object({
  id: IdZod,
});

export type IFindTurmaHasTurnoAulaByIdInput = z.infer<typeof FindTurmaHasTurnoAulaByIdInputZod>;

@InputType('FindTurmaHasTurnoAulaByIdInput')
export class FindTurmaHasTurnoAulaByIdInputType implements IFindTurmaHasTurnoAulaByIdInput {
  @Field(() => Int)
  id!: number;
}
