import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { FindCursoByIdInputZod } from './FindCursoByIdInput';

export const DeleteCursoInputZod = FindCursoByIdInputZod.pick({
  id: true,
});

export type IDeleteCursoInput = z.infer<typeof DeleteCursoInputZod>;

@InputType('DeleteCursoInput')
export class DeleteCursoInputType implements IDeleteCursoInput {
  @Field(() => Int)
  id!: number;
}
