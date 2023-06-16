import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { CreatePermissaoInputZod } from './CreatePermissaoInput';
import { FindPermissaoByIdInputZod } from './FindPermissaoByIdInput';
import GraphQLJSON from 'graphql-type-json';

export const UpdatePermissaoInputZod = z
  .object({})
  .merge(FindPermissaoByIdInputZod)
  .merge(
    CreatePermissaoInputZod.pick({
      descricao: true,
      acao: true,
      recurso: true,
      constraint: true,
    }).partial(),
  );

export type IUpdatePermissaoInput = z.infer<typeof UpdatePermissaoInputZod>;

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
