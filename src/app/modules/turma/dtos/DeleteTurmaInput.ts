import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { FindTurmaByIdInputZod } from './FindTurmaByIdInput';

export const DeleteTurmaInputZod = FindTurmaByIdInputZod.pick({
  id: true,
});

export type IDeleteTurmaInput = z.infer<typeof DeleteTurmaInputZod>;

@InputType('DeleteTurmaInput')
export class DeleteTurmaInputType implements IDeleteTurmaInput {
  @Field(() => Int)
  id!: number;
}
