import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/common/zod/IdZod';
import { z } from 'zod';

export const FindPermissaoByIdInputZod = z.object({
  id: IdZod,
});

export type IFindPermissaoByIdInput = z.infer<typeof FindPermissaoByIdInputZod>;

@InputType('FindPermissaoByIdInput')
export class FindPermissaoByIdInputType implements IFindPermissaoByIdInput {
  @Field(() => Int)
  id!: number;
}
