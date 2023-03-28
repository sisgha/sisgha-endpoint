import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { CreateAulaInputZod } from './CreateAulaInput';
import { FindAulaByIdInputZod } from './FindAulaByIdInput';

export const UpdateAulaInputZod = z
  .object({})
  .merge(FindAulaByIdInputZod)
  .merge(
    CreateAulaInputZod.pick({
      diarioId: true,
      lugarId: true,
      semanaId: true,
      turnoAulaId: true,
    }).partial(),
  );

export type IUpdateAulaInput = z.infer<typeof UpdateAulaInputZod>;

@InputType('UpdateAulaInput')
export class UpdateAulaInputType implements IUpdateAulaInput {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  diarioId?: number;

  @Field(() => Int, { nullable: true })
  semanaId?: number | null;

  @Field(() => Int, { nullable: true })
  turnoAulaId?: number | null;

  @Field(() => Int, { nullable: true })
  lugarId?: number | null;
}
