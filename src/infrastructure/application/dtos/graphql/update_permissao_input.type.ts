import { Field, InputType, Int } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { IUpdatePermissaoInput } from '../../../../domain/dtos/IUpdatePermissaoInput';

@InputType('UpdatePermissaoInput')
export class UpdatePermissaoInputType implements IUpdatePermissaoInput {
  @Field(() => Int)
  id!: number;

  // ...

  @Field(() => String, { nullable: true })
  descricao?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  authorizationConstraintRecipe?: never;

  @Field(() => Boolean, { nullable: true })
  verboGlobal?: boolean;

  @Field(() => [String], { nullable: true })
  verbos?: string[];

  @Field(() => Boolean, { nullable: true })
  recursoGlobal?: boolean;

  @Field(() => [String], { nullable: true })
  recursos?: string[];
}
