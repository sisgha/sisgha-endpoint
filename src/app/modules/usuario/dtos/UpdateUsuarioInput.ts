import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { CreateUsuarioInputZod } from './CreateUsuarioInput';
import { FindUsuarioByIdInputZod } from './FindUsuarioByIdInput';

export const UpdateUsuarioInputZod = z
  .object({})
  .merge(FindUsuarioByIdInputZod)
  .merge(
    CreateUsuarioInputZod.pick({
      email: true,
      matriculaSiape: true,
    }).partial(),
  );

export type IUpdateUsuarioInput = z.infer<typeof UpdateUsuarioInputZod>;

@InputType('UpdateUsuarioInput')
export class UpdateUsuarioInputType implements IUpdateUsuarioInput {
  @Field(() => Int)
  id!: number;

  @Field(() => String, { nullable: true })
  email?: string | undefined;

  @Field(() => String, { nullable: true })
  matriculaSiape?: string | undefined;
}
