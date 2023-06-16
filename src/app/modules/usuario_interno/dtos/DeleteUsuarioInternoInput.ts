import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { FindUsuarioInternoByIdInputZod } from './FindUsuarioInternoByIdInput';

export const DeleteUsuarioInternoInputZod = FindUsuarioInternoByIdInputZod.pick({
  id: true,
});

export type IDeleteUsuarioInternoInput = z.infer<typeof DeleteUsuarioInternoInputZod>;

@InputType('DeleteUsuarioInternoInput')
export class DeleteUsuarioInternoInputType implements IDeleteUsuarioInternoInput {
  @Field(() => Int)
  id!: number;
}
