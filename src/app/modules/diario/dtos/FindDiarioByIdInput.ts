import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/infrastructure/zod/IdZod';
import { z } from 'zod';

export const FindDiarioByIdInputZod = z.object({
  id: IdZod,
});

export type IFindDiarioByIdInput = z.infer<typeof FindDiarioByIdInputZod>;

@InputType('FindDiarioByIdInput')
export class FindDiarioByIdInputType implements IFindDiarioByIdInput {
  @Field(() => Int)
  id!: number;
}
