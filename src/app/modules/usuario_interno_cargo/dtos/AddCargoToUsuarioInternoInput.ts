import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';
import { IdZod } from '../../../../common/zod/IdZod';

export const AddCargoToUsuarioInternoInputZod = z.object({
  cargoId: IdZod,
  usuarioInternoId: IdZod,
});

export type IAddCargoToUsuarioInternoInput = z.infer<typeof AddCargoToUsuarioInternoInputZod>;

@InputType('AddCargoToUsuarioInternoInput')
export class AddCargoToUsuarioInternoInputType implements IAddCargoToUsuarioInternoInput {
  @Field()
  cargoId!: number;

  @Field()
  usuarioInternoId!: number;
}
