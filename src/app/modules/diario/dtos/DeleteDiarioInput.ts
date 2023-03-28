import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { FindDiarioByIdInputZod } from './FindDiarioByIdInput';

export const DeleteDiarioInputZod = FindDiarioByIdInputZod.pick({
  id: true,
});

export type IDeleteDiarioInput = z.infer<typeof DeleteDiarioInputZod>;

@InputType('DeleteDiarioInput')
export class DeleteDiarioInputType implements IDeleteDiarioInput {
  @Field(() => Int)
  id!: number;
}
