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

  @Field(() => String, { nullable: true })
  acao?: string;

  @Field(() => String, { nullable: true })
  recurso?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  constraint?: never;
}
