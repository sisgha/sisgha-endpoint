import { Field, Int, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { IAuthorizationConstraintRecipe } from '../../../../domain/authorization-constraints';
import { PermissaoModel } from '../../../../domain/models/permissao.model';

@ObjectType('Permissao')
export class PermissaoType implements PermissaoModel {
  @Field(() => Int)
  id!: number;

  // ...

  @Field(() => String, { nullable: false })
  descricao!: string;

  @Field(() => Boolean, { nullable: false })
  verboGlobal!: boolean;

  @Field(() => [String], { nullable: false })
  verbos!: string[];

  @Field(() => Boolean, { nullable: false })
  recursoGlobal!: boolean;

  @Field(() => [String], { nullable: false })
  recursos!: string[];

  // ...

  @Field(() => GraphQLJSON, { nullable: false })
  authorizationConstraintRecipe!: IAuthorizationConstraintRecipe;

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
