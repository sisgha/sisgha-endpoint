import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/common/zod/IdZod';
import { z } from 'zod';

export const FindDisciplinaCursoByIdInputZod = z.object({
  id: IdZod,
});

export type IFindDisciplinaCursoByIdInput = z.infer<
  typeof FindDisciplinaCursoByIdInputZod
>;

@InputType('FindDisciplinaCursoByIdInput')
export class FindDisciplinaCursoByIdInputType
  implements IFindDisciplinaCursoByIdInput
{
  @Field(() => Int)
  id!: number;
}
