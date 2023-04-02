import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/common/zod/IdZod';
import { z } from 'zod';

export const FindLugarByIdInputZod = z.object({
  id: IdZod,
});

export type IFindLugarByIdInput = z.infer<typeof FindLugarByIdInputZod>;

@InputType('FindLugarByIdInput')
export class FindLugarByIdInputType implements IFindLugarByIdInput {
  @Field(() => Int)
  id!: number;
}
