import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';
import { IdZod } from '../../../../common/zod/IdZod';

export const FindCargoPermissaoByCargoIdAndPermissaoIdInputZod = z.object({
  cargoId: IdZod,
  permissaoId: IdZod,
});

export type IFindCargoPermissaoByCargoIdAndPermissaoIdInput = z.infer<typeof FindCargoPermissaoByCargoIdAndPermissaoIdInputZod>;

@InputType('FindCargoPermissaoByCargoIdAndPermissaoIdInput')
export class FindCargoPermissaoByCargoIdAndPermissaoIdInputType implements IFindCargoPermissaoByCargoIdAndPermissaoIdInput {
  @Field()
  cargoId!: number;

  @Field()
  permissaoId!: number;
}
