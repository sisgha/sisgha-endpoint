import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/common/zod/IdZod';
import { z } from 'zod';

export const FindDisciplinaCursoByDisciplinaIdAndCursoIdInputZod = z.object({
  disciplinaId: IdZod,
  cursoId: IdZod,
});

export type IFindDisciplinaCursoByDisciplinaIdAndCursoIdInput = z.infer<
  typeof FindDisciplinaCursoByDisciplinaIdAndCursoIdInputZod
>;

@InputType('FindDisciplinaCursoByDisciplinaIdAndCursoIdInput')
export class FindDisciplinaCursoByDisciplinaIdAndCursoIdInputType
  implements IFindDisciplinaCursoByDisciplinaIdAndCursoIdInput
{
  @Field(() => Int)
  disciplinaId!: number;

  @Field(() => Int)
  cursoId!: number;
}
