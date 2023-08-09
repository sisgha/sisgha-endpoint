import { Field, InputType } from '@nestjs/graphql';
import { IRemoveCargoFromUsuarioInternoInput } from '../../../../domain/dtos/IRemoveCargoFromUsuarioInternoInput';

@InputType('RemoveCargoFromUsuarioInternoInput')
export class RemoveCargoFromUsuarioInternoInputType implements IRemoveCargoFromUsuarioInternoInput {
  @Field()
  cargoId!: number;

  @Field()
  usuarioInternoId!: number;
}
