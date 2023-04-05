import { Field, InputType, Int } from '@nestjs/graphql';
import { SearchRequest } from 'src/common/interfaces/SearchRequest';
import { z } from 'zod';
import { GenericSearchInputZod } from '../../../../common/zod/GenericSearchInputZod';

export const ListDisciplinaCursoInputZod = GenericSearchInputZod;

export type IListDisciplinaCursoInput = z.infer<typeof ListDisciplinaCursoInputZod>;

@InputType('ListDisciplinaCursoInput')
export class ListDisciplinaCursoInputType implements SearchRequest, IListDisciplinaCursoInput {
  @Field(() => String, { nullable: true })
  query!: string;

  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => Int, { nullable: true })
  offset?: number;
}
