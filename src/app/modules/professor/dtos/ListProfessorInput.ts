import { Field, InputType, Int } from '@nestjs/graphql';
import { SearchRequest } from 'src/common/interfaces/SearchRequest';
import { z } from 'zod';
import { GenericSearchInputZod } from '../../../../common/zod/GenericSearchInputZod';

export const ListProfessorInputZod = GenericSearchInputZod;

export type IListProfessorInput = z.infer<typeof ListProfessorInputZod>;

@InputType('ListProfessorInput')
export class ListProfessorInputType implements SearchRequest, IListProfessorInput {
  @Field(() => String, { nullable: true })
  query!: string;

  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => Int, { nullable: true })
  offset?: number;
}
