import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { CreateCursoInputZod } from './CreateCursoInput';
import { FindCursoByIdInputZod } from './FindCursoByIdInput';

export const UpdateCursoInputZod = z
  .object({})
  .merge(FindCursoByIdInputZod)
  .merge(CreateCursoInputZod.partial());

export type IUpdateCursoInput = z.infer<typeof UpdateCursoInputZod>;

@InputType('UpdateCursoInput')
export class UpdateCursoInputType implements IUpdateCursoInput {
  @Field(() => Int)
  id!: number;

  @Field(() => String, { nullable: true })
  nome?: string;

  @Field(() => String, { nullable: true })
  tipo?: string;
}
