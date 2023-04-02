import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/common/zod/IdZod';
import { z } from 'zod';

export const FindTurmaByIdInputZod = z.object({
  id: IdZod,
});

export type IFindTurmaByIdInput = z.infer<typeof FindTurmaByIdInputZod>;

@InputType('FindTurmaByIdInput')
export class FindTurmaByIdInputType implements IFindTurmaByIdInput {
  @Field(() => Int)
  id!: number;
}
