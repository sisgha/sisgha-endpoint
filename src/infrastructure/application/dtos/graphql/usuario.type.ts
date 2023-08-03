import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PermissaoType } from './permissao.type';
import { UsuarioModel } from '../../../../domain/models/usuario.model';

@ObjectType('Usuario')
export class UsuarioType implements UsuarioModel {
  @Field(() => Int)
  id!: number;

  // ...

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
}
