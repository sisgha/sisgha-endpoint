import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CargoType } from './cargo.type';
import { UsuarioType } from './usuario.type';
import { UsuarioCargoModel } from '../../../../domain/models/usuario_cargo.model';

@ObjectType('UsuarioCargo')
export class UsuarioCargoType implements UsuarioCargoModel {
  @Field(() => Int)
  id!: number;

  // ...

  @Field(() => UsuarioType)
  usuario!: UsuarioType;

  @Field(() => CargoType)
  cargo!: CargoType;

  // ...
}
