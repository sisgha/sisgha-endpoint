import { Field, InputType, Int } from '@nestjs/graphql';
import { SearchRequest } from 'src/common/interfaces/SearchRequest';
import { z } from 'zod';
import { GenericSearchInputZod } from '../../../../common/zod/GenericSearchInputZod';

export const ListCursoInputZod = GenericSearchInputZod;

export type IListCursoInput = z.infer<typeof ListCursoInputZod>;

@InputType('ListCursoInput')
export class ListCursoInputType implements SearchRequest, IListCursoInput {
  @Field(() => String, { nullable: true })
  query!: string;

  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => Int, { nullable: true })
  offset?: number;
}
