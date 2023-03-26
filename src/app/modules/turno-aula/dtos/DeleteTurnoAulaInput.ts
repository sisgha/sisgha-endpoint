import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { FindTurnoAulaByIdInputZod } from './FindTurnoAulaByIdInput';

export const DeleteTurnoAulaInputZod = FindTurnoAulaByIdInputZod.pick({
  id: true,
});

export type IDeleteTurnoAulaInput = z.infer<typeof DeleteTurnoAulaInputZod>;

@InputType('DeleteTurnoAulaInput')
export class DeleteTurnoAulaInputType implements IDeleteTurnoAulaInput {
  @Field(() => Int)
  id!: number;
}
