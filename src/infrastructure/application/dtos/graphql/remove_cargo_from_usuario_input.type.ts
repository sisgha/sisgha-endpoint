import { Field, InputType } from '@nestjs/graphql';
import { IRemoveCargoFromUsuarioInput } from '../../../../domain/dtos';

@InputType('RemoveCargoFromUsuarioInput')
export class RemoveCargoFromUsuarioInputType implements IRemoveCargoFromUsuarioInput {
  @Field()
  cargoId!: number;

  @Field()
  usuarioId!: number;
}
