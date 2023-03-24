import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/infrastructure/zod/IdZod';
import { z } from 'zod';

export const FindUsuarioByIdInputZod = z.object({
  id: IdZod,
});

export type IFindUsuarioByIdInput = z.infer<typeof FindUsuarioByIdInputZod>;

@InputType('FindUsuarioByIdInput')
export class FindUsuarioByIdInputType implements IFindUsuarioByIdInput {
  @Field(() => Int)
  id!: number;
}
