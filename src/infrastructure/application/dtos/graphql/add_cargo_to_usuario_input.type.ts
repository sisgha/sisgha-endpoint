import { Field, InputType } from '@nestjs/graphql';
import { IAddCargoToUsuarioInput } from '../../../../domain/dtos';

@InputType('AddCargoToUsuarioInput')
export class AddCargoToUsuarioInputType implements IAddCargoToUsuarioInput {
  @Field()
  cargoId!: number;

  @Field()
  usuarioId!: number;
}
