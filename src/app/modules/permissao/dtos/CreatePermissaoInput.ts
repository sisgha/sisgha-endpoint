import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';
import GraphQLJSON from 'graphql-type-json';
import { PermissaoConstraintZod } from '../../../../authorization/PermissaoConstraintZod';

export const CreatePermissaoInputZod = z.object({
  descricao: z.string(),
  acao: z.string(),
  recurso: z.string(),
  constraint: PermissaoConstraintZod,
});

export type ICreatePermissaoInput = z.infer<typeof CreatePermissaoInputZod>;

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
