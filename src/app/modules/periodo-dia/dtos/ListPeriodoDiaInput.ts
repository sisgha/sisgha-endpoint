import { Field, InputType, Int } from '@nestjs/graphql';
import { SearchRequest } from 'src/common/interfaces/SearchRequest';
import { z } from 'zod';
import { GenericSearchInputZod } from '../../../../common/zod/GenericSearchInputZod';

export const ListPeriodoDiaInputZod = GenericSearchInputZod;

export type IListPeriodoDiaInput = z.infer<typeof ListPeriodoDiaInputZod>;

@InputType('ListPeriodoDiaInput')
export class ListPeriodoDiaInputType implements SearchRequest, IListPeriodoDiaInput {
  @Field(() => String, { nullable: true })
  query!: string;

  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => Int, { nullable: true })
  offset?: number;
}
