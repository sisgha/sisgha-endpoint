import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/common/zod/IdZod';
import { z } from 'zod';

export const CreateDiarioInputZod = z.object({
  turmaId: IdZod,
  disciplinaId: IdZod,
});

export type ICreateDiarioInput = z.infer<typeof CreateDiarioInputZod>;

@InputType('CreateDiarioInput')
export class CreateDiarioInputType implements ICreateDiarioInput {
  @Field(() => Int)
  turmaId!: number;

  @Field(() => Int)
  disciplinaId!: number;
}
