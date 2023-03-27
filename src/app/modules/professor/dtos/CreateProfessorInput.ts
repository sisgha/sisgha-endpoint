import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';

export const CreateProfessorInputZod = z.object({
  nome: z.string().max(200),
});

export type ICreateProfessorInput = z.infer<typeof CreateProfessorInputZod>;

@InputType('CreateProfessorInput')
export class CreateProfessorInputType implements ICreateProfessorInput {
  @Field(() => String)
  nome!: string;
}
