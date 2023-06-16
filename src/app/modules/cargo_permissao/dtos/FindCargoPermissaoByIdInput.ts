import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';
import { IdZod } from '../../../../common/zod/IdZod';

export const FindCargoPermissaoByIdInputZod = z.object({
  id: IdZod,
});

export type IFindCargoPermissaoByIdInput = z.infer<typeof FindCargoPermissaoByIdInputZod>;

@InputType('FindCargoPermissaoByIdInput')
export class FindCargoPermissaoByIdInputType implements IFindCargoPermissaoByIdInput {
  @Field()
  id!: number;
}
