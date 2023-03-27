import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { FindDisciplinaByIdInputZod } from './FindDisciplinaByIdInput';

export const DeleteDisciplinaInputZod = FindDisciplinaByIdInputZod.pick({
  id: true,
});

export type IDeleteDisciplinaInput = z.infer<typeof DeleteDisciplinaInputZod>;

@InputType('DeleteDisciplinaInput')
export class DeleteDisciplinaInputType implements IDeleteDisciplinaInput {
  @Field(() => Int)
  id!: number;
}
