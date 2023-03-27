import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/infrastructure/zod/IdZod';
import { z } from 'zod';

export const CreateDisciplinaInputZod = z.object({
  nome: z.string().max(200),

  lugarPadraoId: IdZod.nullable().default(null),
});

export type ICreateDisciplinaInput = z.infer<typeof CreateDisciplinaInputZod>;

@InputType('CreateDisciplinaInput')
export class CreateDisciplinaInputType implements ICreateDisciplinaInput {
  @Field(() => String)
  nome!: string;

  @Field(() => Int, { nullable: true })
  lugarPadraoId!: number | null;
}
