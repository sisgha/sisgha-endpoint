import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';

export const CreateCargoInputZod = z.object({
  slug: z.string(),
});

export type ICreateCargoInput = z.infer<typeof CreateCargoInputZod>;

@InputType('CreateCargoInput')
export class CreateCargoInputType implements ICreateCargoInput {
  @Field()
  slug!: string;
}
