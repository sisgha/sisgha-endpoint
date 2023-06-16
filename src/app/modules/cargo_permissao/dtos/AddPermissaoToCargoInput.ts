import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';
import { IdZod } from '../../../../common/zod/IdZod';

export const AddPermissaoToCargoInputZod = z.object({
  cargoId: IdZod,
  permissaoId: IdZod,
});

export type IAddPermissaoToCargoInput = z.infer<typeof AddPermissaoToCargoInputZod>;

@InputType('AddPermissaoToCargoInput')
export class AddPermissaoToCargoInputType implements IAddPermissaoToCargoInput {
  @Field()
  cargoId!: number;

  @Field()
  permissaoId!: number;
}
