import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';
import { FindCargoByIdInputZod } from './FindCargoByIdInput';

export const DeleteCargoInputZod = FindCargoByIdInputZod.pick({
  id: true,
});

export type IDeleteCargoInput = z.infer<typeof DeleteCargoInputZod>;

@InputType('DeleteCargoInput')
export class DeleteCargoInputType implements IDeleteCargoInput {
  @Field(() => Int)
  id!: number;
}
