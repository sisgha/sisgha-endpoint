import { Field, InputType } from '@nestjs/graphql';
import { IAddCargoToUsuarioInternoInput } from '../../../../domain/dtos';

@InputType('AddCargoToUsuarioInternoInput')
export class AddCargoToUsuarioInternoInputType implements IAddCargoToUsuarioInternoInput {
  @Field()
  cargoId!: number;

  @Field()
  usuarioInternoId!: number;
}
