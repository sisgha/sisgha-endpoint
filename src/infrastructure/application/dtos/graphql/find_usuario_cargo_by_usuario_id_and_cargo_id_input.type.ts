import { Field, InputType } from '@nestjs/graphql';
import { IFindUsuarioCargoByUsuarioIdAndCargoIdInput } from '../../../../domain/dtos';

@InputType('FindUsuarioCargoByUsuarioIdAndCargoIdInput')
export class FindUsuarioCargoByUsuarioIdAndCargoIdInputType implements IFindUsuarioCargoByUsuarioIdAndCargoIdInput {
  @Field()
  usuarioId!: number;

  @Field()
  cargoId!: number;
}
