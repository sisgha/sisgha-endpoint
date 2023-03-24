import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';

export const CreateUsuarioInputZod = z.object({
  email: z.string().email(),
  matriculaSiape: z.string().optional(),
});

export type ICreateUsuarioInput = z.infer<typeof CreateUsuarioInputZod>;

@InputType('CreateUsuarioInput')
export class CreateUsuarioInputType implements ICreateUsuarioInput {
  @Field()
  email!: string;

  @Field({ nullable: true })
  matriculaSiape?: string;
}
