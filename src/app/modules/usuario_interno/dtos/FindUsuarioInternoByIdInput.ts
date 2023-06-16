import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/common/zod/IdZod';
import { z } from 'zod';

export const FindUsuarioInternoByIdInputZod = z.object({
  id: IdZod,
});

export type IFindUsuarioInternoByIdInput = z.infer<typeof FindUsuarioInternoByIdInputZod>;

@InputType('FindUsuarioInternoByIdInput')
export class FindUsuarioInternoByIdInputType implements IFindUsuarioInternoByIdInput {
  @Field(() => Int)
  id!: number;
}
