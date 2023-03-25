import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { CreateLugarInputZod } from './CreateLugarInput';
import { FindLugarByIdInputZod } from './FindLugarByIdInput';

export const UpdateLugarInputZod = z
  .object({})
  .merge(FindLugarByIdInputZod)
  .merge(
    CreateLugarInputZod.pick({
      numero: true,
      tipo: true,
      descricao: true,
    }).partial(),
  );

export type IUpdateLugarInput = z.infer<typeof UpdateLugarInputZod>;

@InputType('UpdateLugarInput')
export class UpdateLugarInputType implements IUpdateLugarInput {
  @Field(() => Int)
  id!: number;

  @Field(() => String, { nullable: true })
  numero?: string;

  @Field(() => String, { nullable: true })
  tipo?: string;

  @Field(() => String, { nullable: true })
  descricao?: string;
}
