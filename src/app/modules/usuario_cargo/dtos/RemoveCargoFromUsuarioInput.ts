import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';
import { IdZod } from '../../../../common/zod/IdZod';

export const RemoveCargoFromUsuarioInputZod = z.object({
  cargoId: IdZod,
  usuarioId: IdZod,
});

export type IRemoveCargoFromUsuarioInput = z.infer<typeof RemoveCargoFromUsuarioInputZod>;

@InputType('RemoveCargoFromUsuarioInput')
export class RemoveCargoFromUsuarioInputType implements IRemoveCargoFromUsuarioInput {
  @Field()
  cargoId!: number;

  @Field()
  usuarioId!: number;
}
