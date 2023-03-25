import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { FindPeriodoDiaByIdInputZod } from './FindPeriodoDiaByIdInput';

export const DeletePeriodoDiaInputZod = FindPeriodoDiaByIdInputZod.pick({
  id: true,
});

export type IDeletePeriodoDiaInput = z.infer<typeof DeletePeriodoDiaInputZod>;

@InputType('DeletePeriodoDiaInput')
export class DeletePeriodoDiaInputType implements IDeletePeriodoDiaInput {
  @Field(() => Int)
  id!: number;
}
