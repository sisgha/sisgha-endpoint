import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CargoType } from '../cargo/cargo.type';

@ObjectType('Usuario')
export class UsuarioType {
  @Field(() => Int)
  id!: number;

  @Field(() => String, { nullable: true })
  email!: string | null;

  @Field(() => String, { nullable: true })
  keycloakId!: string | null;

  @Field(() => String, { nullable: true })
  matriculaSiape!: string | null;

  //

  @Field(() => [CargoType])
  cargos!: CargoType[];
}
