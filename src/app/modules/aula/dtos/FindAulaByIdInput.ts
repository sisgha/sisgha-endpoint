import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/common/zod/IdZod';
import { z } from 'zod';

export const FindAulaByIdInputZod = z.object({
  id: IdZod,
});

export type IFindAulaByIdInput = z.infer<typeof FindAulaByIdInputZod>;

@InputType('FindAulaByIdInput')
export class FindAulaByIdInputType implements IFindAulaByIdInput {
  @Field(() => Int)
  id!: number;
}
