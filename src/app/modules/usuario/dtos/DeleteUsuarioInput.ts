import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { FindUsuarioByIdInputZod } from './FindUsuarioByIdInput';

export const DeleteUsuarioInputZod = FindUsuarioByIdInputZod.pick({ id: true });

export type IDeleteUsuarioInput = z.infer<typeof DeleteUsuarioInputZod>;

@InputType('DeleteUsuarioInput')
export class DeleteUsuarioInputType implements IDeleteUsuarioInput {
  @Field(() => Int)
  id!: number;
}
