import { Field, InputType, Int } from '@nestjs/graphql';
import { ICheckUsuarioHasCargoByUsuarioidAndCargoSlugInput } from '../../../../domain/dtos';

@InputType('CheckUsuarioHasCargoByUsuarioidAndCargoSlugInput')
export class CheckUsuarioHasCargoByUsuarioidAndCargoSlugInputType implements ICheckUsuarioHasCargoByUsuarioidAndCargoSlugInput {
  @Field(() => Int)
  usuarioId!: number;

  @Field(() => String)
  cargoSlug!: string;
}
