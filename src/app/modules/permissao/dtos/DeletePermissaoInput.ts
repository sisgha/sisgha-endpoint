import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { FindPermissaoByIdInputZod } from './FindPermissaoByIdInput';

export const DeletePermissaoInputZod = FindPermissaoByIdInputZod.pick({
  id: true,
});

export type IDeletePermissaoInput = z.infer<typeof DeletePermissaoInputZod>;

@InputType('DeletePermissaoInput')
export class DeletePermissaoInputType implements IDeletePermissaoInput {
  @Field(() => Int)
  id!: number;
}
