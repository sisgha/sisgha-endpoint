import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/infrastructure/zod/IdZod';
import { z } from 'zod';

export const FindCursoByIdInputZod = z.object({
  id: IdZod,
});

export type IFindCursoByIdInput = z.infer<typeof FindCursoByIdInputZod>;

@InputType('FindCursoByIdInput')
export class FindCursoByIdInputType implements IFindCursoByIdInput {
  @Field(() => Int)
  id!: number;
}
