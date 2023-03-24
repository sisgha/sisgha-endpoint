import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/infrastructure/zod/IdZod';
import { z } from 'zod';

export const FindCargoByIdInputZod = z.object({
  id: IdZod,
});

export type IFindCargoByIdInput = z.infer<typeof FindCargoByIdInputZod>;

@InputType('FindCargoByIdInput')
export class FindCargoByIdInputType implements IFindCargoByIdInput {
  @Field(() => Int)
  id!: number;
}
