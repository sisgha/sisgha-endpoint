import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/common/zod/IdZod';
import { z } from 'zod';

export const FindDiaSemanaByIdInputZod = z.object({
  id: IdZod,
});

export type IFindDiaSemanaByIdInput = z.infer<typeof FindDiaSemanaByIdInputZod>;

@InputType('FindDiaSemanaByIdInput')
export class FindDiaSemanaByIdInputType implements IFindDiaSemanaByIdInput {
  @Field(() => Int)
  id!: number;
}
