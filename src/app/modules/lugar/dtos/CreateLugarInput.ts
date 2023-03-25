import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';

export const CreateLugarInputZod = z.object({
  numero: z.string().optional(),

  tipo: z.string().optional(),

  descricao: z.string().optional(),
});

export type ICreateLugarInput = z.infer<typeof CreateLugarInputZod>;

@InputType('CreateLugarInput')
export class CreateLugarInputType implements ICreateLugarInput {
  @Field(() => String, { nullable: true })
  numero?: string;

  @Field(() => String, { nullable: true })
  tipo?: string;

  @Field(() => String, { nullable: true })
  descricao?: string;
}
