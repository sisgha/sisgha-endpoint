import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { CreateTurnoAulaInputZod } from './CreateTurnoAulaInput';
import { FindTurnoAulaByIdInputZod } from './FindTurnoAulaByIdInput';

export const UpdateTurnoAulaInputZod = z
  .object({})
  .merge(FindTurnoAulaByIdInputZod)
  .merge(CreateTurnoAulaInputZod.partial());

export type IUpdateTurnoAulaInput = z.infer<typeof UpdateTurnoAulaInputZod>;

@InputType('UpdateTurnoAulaInput')
export class UpdateTurnoAulaInputType implements IUpdateTurnoAulaInput {
  @Field(() => Int)
  id!: number;

  @Field(() => Int, { nullable: true })
  diaSemanaId?: number;

  @Field(() => Int, { nullable: true })
  periodoDiaId?: number;
}
