import { Field, InputType, Int } from '@nestjs/graphql';
import { z } from 'zod';

export const GenericListInputZod = z.object({
  query: z.string().default(''),

  limit: z.number().int().positive().min(1).max(100).optional(),
  offset: z.number().int().positive().min(0).optional(),

  filter: z.string().optional(),
  sort: z.string().array().optional(),
});

export type IGenericListInput = z.infer<typeof GenericListInputZod>;

@InputType('GenericListInput')
export class GenericListInputType implements IGenericListInput {
  @Field(() => String, { nullable: true })
  query!: string;

  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => Int, { nullable: true })
  offset?: number;

  @Field(() => String, { nullable: true })
  filter?: string;

  @Field(() => [String], { nullable: true })
  sort?: string[];
}
