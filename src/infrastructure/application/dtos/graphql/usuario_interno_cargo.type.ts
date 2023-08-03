import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CargoType } from './cargo.type';
import { UsuarioInternoType } from './usuario_interno.type';

@ObjectType('UsuarioInternoCargo')
export class UsuarioInternoCargoType {
  @Field(() => Int)
  id!: number;

  // ...

  @Field(() => UsuarioInternoType)
  usuarioInterno!: UsuarioInternoType;

  @Field(() => CargoType)
  cargo!: CargoType;

  // ...
}
