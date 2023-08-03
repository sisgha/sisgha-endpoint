import { Field, InputType } from '@nestjs/graphql';
import { IFindUsuarioInternoCargoByUsuarioInternoIdAndCargoIdInput } from '../../../../domain/dtos/IFindUsuarioInternoCargoByUsuarioInternoIdAndCargoIdInput';

@InputType('FindUsuarioInternoCargoByUsuarioInternoIdAndCargoIdInput')
export class FindUsuarioInternoCargoByUsuarioInternoIdAndCargoIdInputType
  implements IFindUsuarioInternoCargoByUsuarioInternoIdAndCargoIdInput
{
  @Field()
  usuarioInternoId!: number;

  @Field()
  cargoId!: number;
}
