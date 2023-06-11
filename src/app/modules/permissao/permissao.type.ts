import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Permissao')
export class PermissaoType {
  @Field(() => Int)
  id!: number;

  @Field(() => String, { nullable: true })
  descricao!: string | null;

  @Field(() => String, { nullable: false })
  acao!: string;

  @Field(() => String, { nullable: false })
  entidade!: string;

  @Field(() => String, { nullable: true })
  condicaoSql!: string | null;

  @Field(() => String, { nullable: true })
  condicaoCaslReceita!: string | null;

  @Field(() => Date, { nullable: false })
  createdAt!: Date;

  @Field(() => Date, { nullable: false })
  updatedAt!: Date;

  @Field(() => Date, { nullable: true })
  deletedAt!: Date | null;
}
