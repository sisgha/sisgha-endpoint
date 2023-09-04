import { Field, InputType, Int } from '@nestjs/graphql';
import { IChecarUsuarioPossuiCargoByUsuarioidAndCargoSlugInput } from '../../../../domain/dtos';

@InputType('ChecarUsuarioPossuiCargoByUsuarioidAndCargoSlugInput')
export class ChecarUsuarioPossuiCargoByUsuarioidAndCargoSlugInputType implements IChecarUsuarioPossuiCargoByUsuarioidAndCargoSlugInput {
  @Field(() => Int)
  usuarioId!: number;

  @Field(() => String)
  cargoSlug!: string;
}
