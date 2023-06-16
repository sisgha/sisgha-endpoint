import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';
import { IdZod } from '../../../../common/zod/IdZod';

export const RemoveCargoFromUsuarioInternoInputZod = z.object({
  cargoId: IdZod,
  usuarioInternoId: IdZod,
});

export type IRemoveCargoFromUsuarioInternoInput = z.infer<typeof RemoveCargoFromUsuarioInternoInputZod>;

@InputType('RemoveCargoFromUsuarioInternoInput')
export class RemoveCargoFromUsuarioInternoInputType implements IRemoveCargoFromUsuarioInternoInput {
  @Field()
  cargoId!: number;

  @Field()
  usuarioInternoId!: number;
}
