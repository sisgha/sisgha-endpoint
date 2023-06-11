import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/common/zod/IdZod';
import { z } from 'zod';

export const FindPermissaoById = z.object({
  id: IdZod,
});

export type IFindPermissaoByIdInput = z.infer<typeof FindPermissaoById>;

@InputType('FindPermissaoByIdInput')
export class FindPermissaoByIdInputType implements IFindPermissaoByIdInput {
  @Field(() => Int)
  id!: number;
}
