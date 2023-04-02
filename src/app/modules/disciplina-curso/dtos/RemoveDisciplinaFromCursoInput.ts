import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/common/zod/IdZod';
import { z } from 'zod';

export const RemoveDisciplinaFromCursoInputZod = z.object({
  disciplinaId: IdZod,
  cursoId: IdZod,
});

export type IRemoveDisciplinaFromCursoInput = z.infer<
  typeof RemoveDisciplinaFromCursoInputZod
>;

@InputType('RemoveDisciplinaFromCursoInput')
export class RemoveDisciplinaFromCursoInputType
  implements IRemoveDisciplinaFromCursoInput
{
  @Field(() => Int)
  disciplinaId!: number;

  @Field(() => Int)
  cursoId!: number;
}
