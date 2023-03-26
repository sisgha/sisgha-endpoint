import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/infrastructure/zod/IdZod';
import { z } from 'zod';

export const FindSemanaByIdInputZod = z.object({
  id: IdZod,
});

export type IFindSemanaByIdInput = z.infer<typeof FindSemanaByIdInputZod>;

@InputType('FindSemanaByIdInput')
export class FindSemanaByIdInputType implements IFindSemanaByIdInput {
  @Field(() => Int)
  id!: number;
}
