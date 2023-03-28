import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { CreateTurmaInputZod } from './CreateTurmaInput';
import { FindTurmaByIdInputZod } from './FindTurmaByIdInput';

export const UpdateTurmaInputZod = z
  .object({})
  .merge(FindTurmaByIdInputZod)
  .merge(
    CreateTurmaInputZod.pick({
      periodo: true,
      turno: true,
      cursoId: true,
      lugarPadraoId: true,
    }).partial(),
  );

export type IUpdateTurmaInput = z.infer<typeof UpdateTurmaInputZod>;

@InputType('UpdateTurmaInput')
export class UpdateTurmaInputType implements IUpdateTurmaInput {
  @Field(() => Int)
  id!: number;

  @Field(() => String, { nullable: true })
  periodo?: string;

  @Field(() => String, { nullable: true })
  turma?: string | null;

  @Field(() => Int, { nullable: true })
  cursoId?: number;

  @Field(() => Int, { nullable: true })
  lugarPadraoId?: number | null;
}
