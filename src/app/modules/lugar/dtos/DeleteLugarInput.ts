import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { FindLugarByIdInputZod } from './FindLugarByIdInput';

export const DeleteLugarInputZod = FindLugarByIdInputZod.pick({ id: true });

export type IDeleteLugarInput = z.infer<typeof DeleteLugarInputZod>;

@InputType('DeleteLugarInput')
export class DeleteLugarInputType implements IDeleteLugarInput {
  @Field(() => Int)
  id!: number;
}
