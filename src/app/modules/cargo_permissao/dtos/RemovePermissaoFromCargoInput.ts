import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';
import { IdZod } from '../../../../common/zod/IdZod';

export const RemovePermissaoFromCargoInputZod = z.object({
  cargoId: IdZod,
  permissaoId: IdZod,
});

export type IRemovePermissaoFromCargoInput = z.infer<typeof RemovePermissaoFromCargoInputZod>;

@InputType('RemovePermissaoFromCargoInput')
export class RemovePermissaoFromCargoInputType implements IRemovePermissaoFromCargoInput {
  @Field()
  cargoId!: number;

  @Field()
  permissaoId!: number;
}
