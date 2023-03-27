import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { CreateDisciplinaInputZod } from './CreateDisciplinaInput';
import { FindDisciplinaByIdInputZod } from './FindDisciplinaByIdInput';

export const UpdateDisciplinaInputZod = z
  .object({})
  .merge(FindDisciplinaByIdInputZod)
  .merge(
    CreateDisciplinaInputZod.pick({
      nome: true,
      lugarPadraoId: true,
    }).partial(),
  );

export type IUpdateDisciplinaInput = z.infer<typeof UpdateDisciplinaInputZod>;

@InputType('UpdateDisciplinaInput')
export class UpdateDisciplinaInputType implements IUpdateDisciplinaInput {
  @Field(() => Int)
  id!: number;

  @Field(() => String, { nullable: true })
  nome?: string;

  @Field(() => Int, { nullable: true })
  lugarPadraoId?: number | null;
}
