import { Field, InputType, Int } from '@nestjs/graphql';
import { SearchRequest } from 'src/common/interfaces/SearchRequest';
import { z } from 'zod';
import { GenericSearchInputZod } from '../../../../common/zod/GenericSearchInputZod';

export const ListAulaInputZod = GenericSearchInputZod;

export type IListAulaInput = z.infer<typeof ListAulaInputZod>;

@InputType('ListAulaInput')
export class ListAulaInputType implements SearchRequest, IListAulaInput {
  @Field(() => String, { nullable: true })
  query!: string;

  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => Int, { nullable: true })
  offset?: number;
}
