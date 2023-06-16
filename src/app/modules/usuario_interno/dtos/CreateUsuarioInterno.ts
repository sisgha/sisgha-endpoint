import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';

export const CreateUsuarioInternoInputZod = z.object({
  tipoAtor: z.string(),
});

export type ICreateUsuarioInternoInput = z.infer<typeof CreateUsuarioInternoInputZod>;

@InputType('CreateUsuarioInternoInput')
export class CreateUsuarioInternoInputType implements ICreateUsuarioInternoInput {
  @Field()
  tipoAtor!: string;
}
