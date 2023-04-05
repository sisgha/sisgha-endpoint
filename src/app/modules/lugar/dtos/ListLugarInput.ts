import { Field, InputType, Int } from '@nestjs/graphql';
import { SearchRequest } from 'src/common/interfaces/SearchRequest';
import { z } from 'zod';
import { GenericSearchInputZod } from '../../../../common/zod/GenericSearchInputZod';

export const ListLugarInputZod = GenericSearchInputZod;

export type IListLugarInput = z.infer<typeof ListLugarInputZod>;

@InputType('ListLugarInput')
export class ListLugarInputType implements SearchRequest, IListLugarInput {
  @Field(() => String, { nullable: true })
  query!: string;

  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => Int, { nullable: true })
  offset?: number;
}
