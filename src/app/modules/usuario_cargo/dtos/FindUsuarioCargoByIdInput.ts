import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';
import { IdZod } from '../../../../common/zod/IdZod';

export const FindUsuarioCargoByIdInputZod = z.object({
  id: IdZod,
});

export type IFindUsuarioCargoByIdInput = z.infer<typeof FindUsuarioCargoByIdInputZod>;

@InputType('FindUsuarioCargoByIdInput')
export class FindUsuarioCargoByIdInputType implements IFindUsuarioCargoByIdInput {
  @Field()
  id!: number;
}
