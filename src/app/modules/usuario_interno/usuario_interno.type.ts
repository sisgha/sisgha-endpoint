import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PermissaoType } from '../permissao/permissao.type';

@ObjectType('UsuarioInterno')
export class UsuarioInternoType {
  @Field(() => Int)
  id!: number;

  // ...

  @Field(() => String, { nullable: false })
  tipoAtor!: string;

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
