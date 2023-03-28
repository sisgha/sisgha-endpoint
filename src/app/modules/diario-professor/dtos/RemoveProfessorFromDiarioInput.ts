import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/infrastructure/zod/IdZod';
import { z } from 'zod';

export const RemoveProfessorFromDiarioInputZod = z.object({
  professorId: IdZod,
  diarioId: IdZod,
});

export type IRemoveProfessorFromDiarioInput = z.infer<
  typeof RemoveProfessorFromDiarioInputZod
>;

@InputType('RemoveProfessorFromDiarioInput')
export class RemoveProfessorFromDiarioInputType
  implements IRemoveProfessorFromDiarioInput
{
  @Field(() => Int)
  professorId!: number;

  @Field(() => Int)
  diarioId!: number;
}
