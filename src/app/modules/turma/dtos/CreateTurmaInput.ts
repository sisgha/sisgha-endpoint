import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/common/zod/IdZod';
import { z } from 'zod';

export const CreateTurmaInputZod = z.object({
  periodo: z.string().max(20),

  turno: z.string().max(20).nullable().optional(),

  cursoId: IdZod,

  lugarPadraoId: IdZod.nullable(),
});

export type ICreateTurmaInput = z.infer<typeof CreateTurmaInputZod>;

@InputType('CreateTurmaInput')
export class CreateTurmaInputType implements ICreateTurmaInput {
  @Field(() => String)
  periodo!: string;

  @Field(() => String, { nullable: true })
  turno!: string | null;

  @Field(() => Int)
  cursoId!: number;

  @Field(() => Int, { nullable: true })
  lugarPadraoId!: number | null;
}
