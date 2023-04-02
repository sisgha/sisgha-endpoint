import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/common/zod/IdZod';
import { z } from 'zod';

export const FindDisciplinaByIdInputZod = z.object({
  id: IdZod,
});

export type IFindDisciplinaByIdInput = z.infer<typeof FindDisciplinaByIdInputZod>;

@InputType('FindDisciplinaByIdInput')
export class FindDisciplinaByIdInputType implements IFindDisciplinaByIdInput {
  @Field(() => Int)
  id!: number;
}
