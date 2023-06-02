import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/common/zod/IdZod';
import { z } from 'zod';

export const FindDiarioProfessorByIdInputZod = z.object({
  id: IdZod,
});

export type IFindDiarioProfessorByIdInput = z.infer<
  typeof FindDiarioProfessorByIdInputZod
>;

@InputType('FindDiarioProfessorByIdInput')
export class FindDiarioProfessorByIdInputType
  implements IFindDiarioProfessorByIdInput
{
  @Field(() => Int)
  id!: number;
}
