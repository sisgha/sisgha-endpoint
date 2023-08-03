import { Field, InputType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { ICreatePermissaoInput } from '../../../../domain/dtos';

@InputType('CreatePermissaoInput')
export class CreatePermissaoInputType implements ICreatePermissaoInput {
  @Field()
  descricao!: string;

  @Field()
  acao!: string;

  @Field()
  recurso!: string;

  @Field(() => GraphQLJSON, { nullable: true })
  constraint!: never;
}
