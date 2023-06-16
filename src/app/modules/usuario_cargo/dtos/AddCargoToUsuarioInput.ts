import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';
import { IdZod } from '../../../../common/zod/IdZod';

export const AddCargoToUsuarioInputZod = z.object({
  cargoId: IdZod,
  usuarioId: IdZod,
});

export type IAddCargoToUsuarioInput = z.infer<typeof AddCargoToUsuarioInputZod>;

@InputType('AddCargoToUsuarioInput')
export class AddCargoToUsuarioInputType implements IAddCargoToUsuarioInput {
  @Field()
  cargoId!: number;

  @Field()
  usuarioId!: number;
}
