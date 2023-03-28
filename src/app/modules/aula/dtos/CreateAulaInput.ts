import { Field, InputType, Int } from '@nestjs/graphql';
import { IdZod } from 'src/infrastructure/zod/IdZod';
import { z } from 'zod';

export const CreateAulaInputZod = z.object({
  diarioId: IdZod,
  //
  semanaId: IdZod.nullable(),
  turnoAulaId: IdZod.nullable(),
  lugarId: IdZod.nullable(),
});

export type ICreateAulaInput = z.infer<typeof CreateAulaInputZod>;

@InputType('CreateAulaInput')
export class CreateAulaInputType implements ICreateAulaInput {
  @Field(() => Int)
  diarioId!: number;

  @Field(() => Int, { nullable: true })
  semanaId!: number | null;

  @Field(() => Int, { nullable: true })
  turnoAulaId!: number | null;

  @Field(() => Int, { nullable: true })
  lugarId!: number | null;
}
