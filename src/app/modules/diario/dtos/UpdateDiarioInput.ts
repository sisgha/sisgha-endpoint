import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { CreateDiarioInputZod } from './CreateDiarioInput';
import { FindDiarioByIdInputZod } from './FindDiarioByIdInput';

export const UpdateDiarioInputZod = z
  .object({})
  .merge(FindDiarioByIdInputZod)
  .merge(
    CreateDiarioInputZod.pick({
      turmaId: true,
      disciplinaId: true,
    }).partial(),
  );

export type IUpdateDiarioInput = z.infer<typeof UpdateDiarioInputZod>;

@InputType('UpdateDiarioInput')
export class UpdateDiarioInputType implements IUpdateDiarioInput {
  @Field(() => Int)
  id!: number;

  @Field(() => Int, { nullable: true })
  turmaId?: number;

  @Field(() => Int, { nullable: true })
  disciplinaId?: number;
}
