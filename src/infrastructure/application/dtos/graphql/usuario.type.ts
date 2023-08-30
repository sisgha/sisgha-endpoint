import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UsuarioModel } from '../../../../domain/models/usuario.model';
import { CargoType } from './cargo.type';
import { PermissaoType } from './permissao.type';

@ObjectType('Usuario')
export class UsuarioType implements UsuarioModel {
  @Field(() => Int)
  id!: number;

  // ...

  @Field(() => String, { nullable: true })
  nome!: string | null;

  @Field(() => String, { nullable: true })
  email!: string | null;

  @Field(() => String, { nullable: true })
  matriculaSiape!: string | null;

  //

  @Field(() => String, { nullable: true })
  keycloakId!: string | null;

  // ...

  @Field(() => Date)
  dateCreated!: Date;

  @Field(() => Date)
  dateUpdated!: Date;

  @Field(() => Date, { nullable: true })
  dateDeleted!: Date | null;

  @Field(() => Date, { nullable: true })
  dateSearchSync!: Date | null;

  // ...

  @Field(() => [PermissaoType])
  permissoes!: PermissaoType[];

  @Field(() => [CargoType])
  cargos!: CargoType[];
}
