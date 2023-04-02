import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/common/zod/IdZod';
import { z } from 'zod';

export const FindDiarioProfessorByProfessorIdAndDiarioIdInputZod = z.object({
  professorId: IdZod,
  diarioId: IdZod,
});

export type IFindDiarioProfessorByProfessorIdAndDiarioIdInput = z.infer<
  typeof FindDiarioProfessorByProfessorIdAndDiarioIdInputZod
>;

@InputType('FindDiarioProfessorByProfessorIdAndDiarioIdInput')
export class FindDiarioProfessorByProfessorIdAndDiarioIdInputType
  implements IFindDiarioProfessorByProfessorIdAndDiarioIdInput
{
  @Field(() => Int)
  professorId!: number;

  @Field(() => Int)
  diarioId!: number;
}
