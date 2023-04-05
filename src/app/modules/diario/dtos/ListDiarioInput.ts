import { Field, InputType, Int } from '@nestjs/graphql';
import { SearchRequest } from 'src/common/interfaces/SearchRequest';
import { z } from 'zod';
import { GenericSearchInputZod } from '../../../../common/zod/GenericSearchInputZod';

export const ListDiarioInputZod = GenericSearchInputZod;

export type IListDiarioInput = z.infer<typeof ListDiarioInputZod>;

@InputType('ListDiarioInput')
export class ListDiarioInputType implements SearchRequest, IListDiarioInput {
  @Field(() => String, { nullable: true })
  query!: string;

  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => Int, { nullable: true })
  offset?: number;
}
