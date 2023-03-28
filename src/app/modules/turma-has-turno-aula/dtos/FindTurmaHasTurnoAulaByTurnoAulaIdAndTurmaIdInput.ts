import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/infrastructure/zod/IdZod';
import { z } from 'zod';

export const FindTurmaHasTurnoAulaByTurnoAulaIdAndTurmaIdInputZod = z.object({
  turmaId: IdZod,
  turnoAulaId: IdZod,
});

export type IFindTurmaHasTurnoAulaByTurnoAulaIdAndTurmaIdInput = z.infer<
  typeof FindTurmaHasTurnoAulaByTurnoAulaIdAndTurmaIdInputZod
>;

@InputType('FindTurmaHasTurnoAulaByTurnoAulaIdAndTurmaIdInput')
export class FindTurmaHasTurnoAulaByTurnoAulaIdAndTurmaIdInputType
  implements IFindTurmaHasTurnoAulaByTurnoAulaIdAndTurmaIdInput
{
  @Field(() => Int)
  turmaId!: number;

  @Field(() => Int)
  turnoAulaId!: number;
}
