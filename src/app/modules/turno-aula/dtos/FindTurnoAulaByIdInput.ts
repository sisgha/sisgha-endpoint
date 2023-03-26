import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/infrastructure/zod/IdZod';
import { z } from 'zod';

export const FindTurnoAulaByIdInputZod = z.object({
  id: IdZod,
});

export type IFindTurnoAulaByIdInput = z.infer<typeof FindTurnoAulaByIdInputZod>;

@InputType('FindTurnoAulaByIdInput')
export class FindTurnoAulaByIdInputType implements IFindTurnoAulaByIdInput {
  @Field(() => Int)
  id!: number;
}
