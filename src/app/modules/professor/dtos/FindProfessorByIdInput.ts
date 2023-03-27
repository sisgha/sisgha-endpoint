import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/infrastructure/zod/IdZod';
import { z } from 'zod';

export const FindProfessorByIdInputZod = z.object({
  id: IdZod,
});

export type IFindProfessorByIdInput = z.infer<typeof FindProfessorByIdInputZod>;

@InputType('FindProfessorByIdInput')
export class FindProfessorByIdInputType implements IFindProfessorByIdInput {
  @Field(() => Int)
  id!: number;
}
