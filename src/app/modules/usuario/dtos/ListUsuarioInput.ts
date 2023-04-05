import { Field, InputType, Int } from '@nestjs/graphql';
import { SearchRequest } from 'src/common/interfaces/SearchRequest';
import { z } from 'zod';
import { GenericSearchInputZod } from '../../../../common/zod/GenericSearchInputZod';

export const ListUsuarioInputZod = GenericSearchInputZod;

export type IListUsuarioInput = z.infer<typeof ListUsuarioInputZod>;

@InputType('ListUsuarioInput')
export class ListUsuarioInputType implements SearchRequest, IListUsuarioInput {
  @Field(() => String, { nullable: true })
  query!: string;

  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => Int, { nullable: true })
  offset?: number;
}
