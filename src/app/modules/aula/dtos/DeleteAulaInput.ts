import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { FindAulaByIdInputZod } from './FindAulaByIdInput';

export const DeleteAulaInputZod = FindAulaByIdInputZod.pick({
  id: true,
});

export type IDeleteAulaInput = z.infer<typeof DeleteAulaInputZod>;

@InputType('DeleteAulaInput')
export class DeleteAulaInputType implements IDeleteAulaInput {
  @Field(() => Int)
  id!: number;
}
