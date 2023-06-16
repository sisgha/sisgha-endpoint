import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { CreateCargoInputZod } from './CreateCargoInput';
import { FindCargoByIdInputZod } from './FindCargoByIdInput';

export const UpdateCargoInputZod = z
  .object({})
  .merge(FindCargoByIdInputZod)
  .merge(
    CreateCargoInputZod.pick({
      slug: true,
    }).partial(),
  );

export type IUpdateCargoInput = z.infer<typeof UpdateCargoInputZod>;

@InputType('UpdateCargoInput')
export class UpdateCargoInputType implements IUpdateCargoInput {
  @Field(() => Int)
  id!: number;

  // ...

  @Field({ nullable: true })
  slug?: string;
}
