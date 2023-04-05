import { Field, InputType, Int } from '@nestjs/graphql';
import { SearchRequest } from 'src/common/interfaces/SearchRequest';
import { z } from 'zod';
import { GenericSearchInputZod } from '../../../../common/zod/GenericSearchInputZod';

export const ListDiarioProfessorInputZod = GenericSearchInputZod;

export type IListDiarioProfessorInput = z.infer<typeof ListDiarioProfessorInputZod>;

@InputType('ListDiarioProfessorInput')
export class ListDiarioProfessorInputType implements SearchRequest, IListDiarioProfessorInput {
  @Field(() => String, { nullable: true })
  query!: string;

  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => Int, { nullable: true })
  offset?: number;
}
