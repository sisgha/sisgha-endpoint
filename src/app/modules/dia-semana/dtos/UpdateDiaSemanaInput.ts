import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { CreateDiaSemanaInputZod } from './CreateDiaSemanaInput';
import { FindDiaSemanaByIdInputZod } from './FindDiaSemanaByIdInput';

export const UpdateDiaSemanaInputZod = z
  .object({})
  .merge(FindDiaSemanaByIdInputZod)
  .merge(
    CreateDiaSemanaInputZod.pick({
      ordem: true,
    }).partial(),
  );

export type IUpdateDiaSemanaInput = z.infer<typeof UpdateDiaSemanaInputZod>;

@InputType('UpdateDiaSemanaInput')
export class UpdateDiaSemanaInputType implements IUpdateDiaSemanaInput {
  @Field(() => Int)
  id!: number;

  @Field(() => Int, { nullable: true })
  ordem?: number;
}
