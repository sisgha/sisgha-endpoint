import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CargoType } from '../cargo/cargo.type';
import { PermissaoType } from '../permissao/permissao.type';

@ObjectType('CargoPermissao')
export class CargoPermissaoType {
  @Field(() => Int)
  id!: number;

  // ...

  @Field(() => CargoType)
  cargo!: CargoType;

  @Field(() => PermissaoType)
  permissao!: PermissaoType;

  //
}
