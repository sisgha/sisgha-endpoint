import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { CreateProfessorInputZod } from './CreateProfessorInput';
import { FindProfessorByIdInputZod } from './FindProfessorByIdInput';

export const UpdateProfessorInputZod = z
  .object({})
  .merge(FindProfessorByIdInputZod)
  .merge(
    CreateProfessorInputZod.pick({
      nome: true,
    }).partial(),
  );

export type IUpdateProfessorInput = z.infer<typeof UpdateProfessorInputZod>;

@InputType('UpdateProfessorInput')
export class UpdateProfessorInputType implements IUpdateProfessorInput {
  @Field(() => Int)
  id!: number;

  @Field(() => String, { nullable: true })
  nome?: string;
}
