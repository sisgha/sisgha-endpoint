import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/common/zod/IdZod';
import { z } from 'zod';

export const AddProfessorToDiarioInputZod = z.object({
  professorId: IdZod,
  diarioId: IdZod,
});

export type IAddProfessorToDiarioInput = z.infer<
  typeof AddProfessorToDiarioInputZod
>;

@InputType('AddProfessorToDiarioInput')
export class AddProfessorToDiarioInputType
  implements IAddProfessorToDiarioInput
{
  @Field(() => Int)
  professorId!: number;

  @Field(() => Int)
  diarioId!: number;
}
