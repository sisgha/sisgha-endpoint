import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';

export const CreateDiaSemanaInputZod = z.object({
  ordem: z.number().int().positive().min(0).max(6),
});

export type ICreateDiaSemanaInput = z.infer<typeof CreateDiaSemanaInputZod>;

@InputType('CreateDiaSemanaInput')
export class CreateDiaSemanaInputType implements ICreateDiaSemanaInput {
  @Field(() => Int)
  ordem!: number;
}
