import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { FindDiaSemanaByIdInputZod } from './FindDiaSemanaByIdInput';

export const DeleteDiaSemanaInputZod = FindDiaSemanaByIdInputZod.pick({
  id: true,
});

export type IDeleteDiaSemanaInput = z.infer<typeof DeleteDiaSemanaInputZod>;

@InputType('DeleteDiaSemanaInput')
export class DeleteDiaSemanaInputType implements IDeleteDiaSemanaInput {
  @Field(() => Int)
  id!: number;
}
