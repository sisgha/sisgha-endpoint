import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/common/zod/IdZod';
import { z } from 'zod';

export const RemoveTurnoAulaFromTurmaInputZod = z.object({
  turmaId: IdZod,
  turnoAulaId: IdZod,
});

export type IRemoveTurnoAulaFromTurmaInput = z.infer<
  typeof RemoveTurnoAulaFromTurmaInputZod
>;

@InputType('RemoveTurnoAulaFromTurmaInput')
export class RemoveTurnoAulaFromTurmaInputType
  implements IRemoveTurnoAulaFromTurmaInput
{
  @Field(() => Int)
  turmaId!: number;

  @Field(() => Int)
  turnoAulaId!: number;
}
