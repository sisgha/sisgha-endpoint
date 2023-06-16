import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CargoType } from '../cargo/cargo.type';
import { UsuarioType } from '../usuario/usuario.type';

@ObjectType('UsuarioCargo')
export class UsuarioCargoType {
  @Field(() => Int)
  id!: number;

  // ...

  @Field(() => UsuarioType)
  usuario!: UsuarioType;

  @Field(() => CargoType)
  cargo!: CargoType;

  // ...
}
