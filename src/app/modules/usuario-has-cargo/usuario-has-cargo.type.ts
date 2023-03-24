import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CargoType } from '../cargo/cargo.type';
import { UsuarioType } from '../usuario/usuario.type';

@ObjectType('UsuarioHasCargo')
export class UsuarioHasCargoType {
  @Field(() => Int)
  id!: number;

  @Field(() => UsuarioType)
  usuario!: UsuarioType;

  @Field(() => CargoType)
  cargo!: CargoType;
}
