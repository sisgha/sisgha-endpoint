import { Field, InputType, Int } from '@nestjs/graphql';
import { SearchRequest } from 'src/common/interfaces/SearchRequest';
import { z } from 'zod';
import { GenericSearchInputZod } from '../../../../common/zod/GenericSearchInputZod';

export const ListDiaSemanaInputZod = GenericSearchInputZod;

export type IListDiaSemanaInput = z.infer<typeof ListDiaSemanaInputZod>;

@InputType('ListDiaSemanaInput')
export class ListDiaSemanaInputType implements SearchRequest, IListDiaSemanaInput {
  @Field(() => String, { nullable: true })
  query!: string;

  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => Int, { nullable: true })
  offset?: number;
}
