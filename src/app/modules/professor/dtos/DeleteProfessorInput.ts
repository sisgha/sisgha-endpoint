import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { FindProfessorByIdInputZod } from './FindProfessorByIdInput';

export const DeleteProfessorInputZod = FindProfessorByIdInputZod.pick({
  id: true,
});

export type IDeleteProfessorInput = z.infer<typeof DeleteProfessorInputZod>;

@InputType('DeleteProfessorInput')
export class DeleteProfessorInputType implements IDeleteProfessorInput {
  @Field(() => Int)
  id!: number;
}
