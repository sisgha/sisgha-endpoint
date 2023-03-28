import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/infrastructure/zod/IdZod';
import { z } from 'zod';

export const AddTurnoAulaToTurmaInputZod = z.object({
  turmaId: IdZod,
  turnoAulaId: IdZod,
});

export type IAddTurnoAulaToTurmaInput = z.infer<
  typeof AddTurnoAulaToTurmaInputZod
>;

@InputType('AddTurnoAulaToTurmaInput')
export class AddTurnoAulaToTurmaInputType implements IAddTurnoAulaToTurmaInput {
  @Field(() => Int)
  turmaId!: number;

  @Field(() => Int)
  turnoAulaId!: number;
}
