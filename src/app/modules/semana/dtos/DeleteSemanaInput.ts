import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { FindSemanaByIdInputZod } from './FindSemanaByIdInput';

export const DeleteSemanaInputZod = FindSemanaByIdInputZod.pick({
  id: true,
});

export type IDeleteSemanaInput = z.infer<typeof DeleteSemanaInputZod>;

@InputType('DeleteSemanaInput')
export class DeleteSemanaInputType implements IDeleteSemanaInput {
  @Field(() => Int)
  id!: number;
}
