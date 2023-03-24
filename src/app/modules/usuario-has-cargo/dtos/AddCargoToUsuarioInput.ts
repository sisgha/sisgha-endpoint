import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { FindCargoByIdInputZod } from '../../cargo/dtos';
import { FindUsuarioByIdInputZod } from '../../usuario/dtos';

export const AddCargoToUsuarioInputZod = z.object({
  cargoId: FindCargoByIdInputZod.shape.id,
  usuarioId: FindUsuarioByIdInputZod.shape.id,
});

export type IAddCargoToUsuarioInput = z.infer<typeof AddCargoToUsuarioInputZod>;

@InputType('AddCargoToUsuarioInput')
export class AddCargoToUsuarioInputType implements IAddCargoToUsuarioInput {
  @Field(() => Int)
  cargoId!: number;

  @Field(() => Int)
  usuarioId!: number;
}
