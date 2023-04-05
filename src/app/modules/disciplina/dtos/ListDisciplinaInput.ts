import { Field, InputType, Int } from '@nestjs/graphql';
import { SearchRequest } from 'src/common/interfaces/SearchRequest';
import { z } from 'zod';
import { GenericSearchInputZod } from '../../../../common/zod/GenericSearchInputZod';

export const ListDisciplinaInputZod = GenericSearchInputZod;

export type IListDisciplinaInput = z.infer<typeof ListDisciplinaInputZod>;

@InputType('ListDisciplinaInput')
export class ListDisciplinaInputType implements SearchRequest, IListDisciplinaInput {
  @Field(() => String, { nullable: true })
  query!: string;

  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => Int, { nullable: true })
  offset?: number;
}
