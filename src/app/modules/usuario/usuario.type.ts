import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PermissaoType } from '../permissao/permissao.type';

@ObjectType('Usuario')
export class UsuarioType {
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
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => Date, { nullable: true })
  deletedAt!: Date | null;

  @Field(() => Date, { nullable: true })
  searchSyncAt!: Date | null;

  // ...

  @Field(() => [PermissaoType])
  permissoes!: PermissaoType[];
}
