import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';

export const CreateCursoInputZod = z.object({
  nome: z.string().max(200),
  tipo: z.string().max(200),
});

export type ICreateCursoInput = z.infer<typeof CreateCursoInputZod>;

@InputType('CreateCursoInput')
export class CreateCursoInputType implements ICreateCursoInput {
  @Field(() => String)
  nome!: string;

  @Field(() => String)
  tipo!: string;
}
