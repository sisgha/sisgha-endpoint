import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/common/zod/IdZod';
import { z } from 'zod';

export const FindPeriodoDiaByIdInputZod = z.object({
  id: IdZod,
});

export type IFindPeriodoDiaByIdInput = z.infer<
  typeof FindPeriodoDiaByIdInputZod
>;

@InputType('FindPeriodoDiaByIdInput')
export class FindPeriodoDiaByIdInputType implements IFindPeriodoDiaByIdInput {
  @Field(() => Int)
  id!: number;
}
