import { Field, InputType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { ICreatePermissaoInput } from '../../../../domain/dtos';

@InputType('CreatePermissaoInput')
export class CreatePermissaoInputType implements ICreatePermissaoInput {
  @Field()
  descricao!: string;

  @Field(() => GraphQLJSON, { nullable: true })
  authorizationConstraintRecipe!: never;

  @Field(() => Boolean, { nullable: false })
  verboGlobal!: boolean;

  @Field(() => [String], { nullable: false })
  verbos!: string[];

  @Field(() => [String], { nullable: false })
  recursos!: string[];

  @Field(() => Boolean, { nullable: false })
  recursoGlobal!: boolean;
}
