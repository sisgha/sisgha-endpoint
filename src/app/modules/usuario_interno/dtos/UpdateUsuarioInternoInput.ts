import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { CreateUsuarioInternoInputZod } from './CreateUsuarioInterno';
import { FindUsuarioInternoByIdInputZod } from './FindUsuarioInternoByIdInput';

export const UpdateUsuarioInternoInputZod = z
  .object({})
  .merge(FindUsuarioInternoByIdInputZod)
  .merge(
    CreateUsuarioInternoInputZod.pick({
      tipoAtor: true,
    }).partial(),
  );

export type IUpdateUsuarioInternoInput = z.infer<typeof UpdateUsuarioInternoInputZod>;

@InputType('UpdateUsuarioInternoInput')
export class UpdateUsuarioInternoInputType implements IUpdateUsuarioInternoInput {
  @Field(() => Int)
  id!: number;

  @Field(() => String, { nullable: true })
  tipoAtor?: string;
}
