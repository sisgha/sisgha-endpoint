import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/common/zod/IdZod';
import { z } from 'zod';

export const AddDisciplinaToCursoInputZod = z.object({
  disciplinaId: IdZod,
  cursoId: IdZod,
});

export type IAddDisciplinaToCursoInput = z.infer<
  typeof AddDisciplinaToCursoInputZod
>;

@InputType('AddDisciplinaToCursoInput')
export class AddDisciplinaToCursoInputType
  implements IAddDisciplinaToCursoInput
{
  @Field(() => Int)
  disciplinaId!: number;

  @Field(() => Int)
  cursoId!: number;
}
