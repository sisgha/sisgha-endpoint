import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { FindCargoByIdInputZod } from '../../cargo/dtos';
import { FindUsuarioByIdInputZod } from '../../usuario/dtos';

export const FindUsuarioHasCargoByUsuarioIdAndCargoIdInputZod = z.object({
  cargoId: FindCargoByIdInputZod.shape.id,
  usuarioId: FindUsuarioByIdInputZod.shape.id,
});

export type IFindUsuarioHasCargoByUsuarioIdAndCargoIdInput = z.infer<
  typeof FindUsuarioHasCargoByUsuarioIdAndCargoIdInputZod
>;

@InputType('FindUsuarioHasCargoByUsuarioIdAndCargoIdInput')
export class FindUsuarioHasCargoByUsuarioIdAndCargoIdInputType
  implements IFindUsuarioHasCargoByUsuarioIdAndCargoIdInput
{
  @Field(() => Int)
  cargoId!: number;

  @Field(() => Int)
  usuarioId!: number;
}
