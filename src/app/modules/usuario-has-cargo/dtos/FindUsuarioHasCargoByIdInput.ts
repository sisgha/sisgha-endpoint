import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/common/zod/IdZod';
import { z } from 'zod';

export const FindUsuarioHasCargoByIdInputZod = z.object({
  id: IdZod,
});

export type IFindUsuarioHasCargoByIdInput = z.infer<
  typeof FindUsuarioHasCargoByIdInputZod
>;

@InputType('FindUsuarioHasCargoByIdInput')
export class FindUsuarioHasCargoByIdInputType
  implements IFindUsuarioHasCargoByIdInput
{
  @Field(() => Int)
  id!: number;
}
