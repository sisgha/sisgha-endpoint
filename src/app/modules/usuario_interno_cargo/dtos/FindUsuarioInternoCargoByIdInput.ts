import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';
import { IdZod } from '../../../../common/zod/IdZod';

export const FindUsuarioInternoCargoByIdInputZod = z.object({
  id: IdZod,
});

export type IFindUsuarioInternoCargoByIdInput = z.infer<typeof FindUsuarioInternoCargoByIdInputZod>;

@InputType('FindUsuarioInternoCargoByIdInput')
export class FindUsuarioInternoCargoByIdInputType implements IFindUsuarioInternoCargoByIdInput {
  @Field()
  id!: number;
}
