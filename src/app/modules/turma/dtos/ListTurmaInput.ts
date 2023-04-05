import { Field, InputType, Int } from '@nestjs/graphql';
import { SearchRequest } from 'src/common/interfaces/SearchRequest';
import { z } from 'zod';
import { GenericSearchInputZod } from '../../../../common/zod/GenericSearchInputZod';

export const ListTurmaInputZod = GenericSearchInputZod;

export type IListTurmaInput = z.infer<typeof ListTurmaInputZod>;

@InputType('ListTurmaInput')
export class ListTurmaInputType implements SearchRequest, IListTurmaInput {
  @Field(() => String, { nullable: true })
  query!: string;

  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => Int, { nullable: true })
  offset?: number;
}
