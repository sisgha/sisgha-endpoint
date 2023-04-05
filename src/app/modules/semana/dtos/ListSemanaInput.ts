import { Field, InputType, Int } from '@nestjs/graphql';
import { SearchRequest } from 'src/common/interfaces/SearchRequest';
import { z } from 'zod';
import { GenericSearchInputZod } from '../../../../common/zod/GenericSearchInputZod';

export const ListSemanaInputZod = GenericSearchInputZod;

export type IListSemanaInput = z.infer<typeof ListSemanaInputZod>;

@InputType('ListSemanaInput')
export class ListSemanaInputType implements SearchRequest, IListSemanaInput {
  @Field(() => String, { nullable: true })
  query!: string;

  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => Int, { nullable: true })
  offset?: number;
}
