import { Field, Int, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { IRawConstraint } from '../../../authorization/interfaces';

@ObjectType('Permissao')
export class PermissaoType {
  @Field(() => Int)
  id!: number;

  // ...

  @Field(() => String, { nullable: false })
  descricao!: string;

  //

  @Field(() => String, { nullable: false })
  acao!: string;

  @Field(() => String, { nullable: false })
  recurso!: string;

  //

  @Field(() => GraphQLJSON, { nullable: false })
  constraint!: IRawConstraint;

  // ...

  @Field(() => Date, { nullable: false })
  createdAt!: Date;

  @Field(() => Date, { nullable: false })
  updatedAt!: Date;

  @Field(() => Date, { nullable: true })
  deletedAt!: Date | null;

  @Field(() => Date, { nullable: true })
  searchSyncAt!: Date | null;
}
