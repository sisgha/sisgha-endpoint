import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { FindCargoByIdInputZod } from '../../cargo/dtos';
import { FindUsuarioByIdInputZod } from '../../usuario/dtos';

export const RemoveCargoFromUsuarioInputZod = z.object({
  cargoId: FindCargoByIdInputZod.shape.id,
  usuarioId: FindUsuarioByIdInputZod.shape.id,
});

export type IRemoveCargoFromUsuarioInput = z.infer<
  typeof RemoveCargoFromUsuarioInputZod
>;

@InputType('RemoveCargoFromUsuarioInput')
export class RemoveCargoFromUsuarioInputType
  implements IRemoveCargoFromUsuarioInput
{
  @Field(() => Int)
  cargoId!: number;

  @Field(() => Int)
  usuarioId!: number;
}
