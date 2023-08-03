import { Field, Int, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { PermissaoModel } from '../../../../domain/models/permissao.model';
import { IAuthorizationConstraintRecipe } from '../../../../domain/authorization-constraints';

@ObjectType('Permissao')
export class PermissaoType implements PermissaoModel {
  @Field(() => Int)
  id!: number;

  // ...

  @Field(() => String, { nullable: false })
  descricao!: string;

  @Field(() => String, { nullable: false })
  acao!: string;

  @Field(() => String, { nullable: false })
  recurso!: string;

  // ...

  @Field(() => GraphQLJSON, { nullable: false })
  constraint!: IAuthorizationConstraintRecipe;

  // ...

  @Field(() => Date, { nullable: false })
  dateCreated!: Date;

  @Field(() => Date, { nullable: false })
  dateUpdated!: Date;

  @Field(() => Date, { nullable: true })
  dateDeleted!: Date | null;

  @Field(() => Date, { nullable: true })
  dateSearchSync!: Date | null;
}
