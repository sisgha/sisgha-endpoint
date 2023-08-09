import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CargoPermissaoModel } from '../../../../domain/models/cargo_permissao.model';
import { CargoType } from './index';
import { PermissaoType } from './permissao.type';

@ObjectType('CargoPermissao')
export class CargoPermissaoType implements CargoPermissaoModel {
  @Field(() => Int)
  id!: number;

  // ...

  @Field(() => CargoType)
  cargo!: CargoType;

  @Field(() => PermissaoType)
  permissao!: PermissaoType;

  //
}
