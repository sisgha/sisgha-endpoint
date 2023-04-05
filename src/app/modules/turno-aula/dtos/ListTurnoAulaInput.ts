import { Field, InputType, Int } from '@nestjs/graphql';
import { SearchRequest } from 'src/common/interfaces/SearchRequest';
import { z } from 'zod';
import { GenericSearchInputZod } from '../../../../common/zod/GenericSearchInputZod';

export const ListTurnoAulaInputZod = GenericSearchInputZod;

export type IListTurnoAulaInput = z.infer<typeof ListTurnoAulaInputZod>;

@InputType('ListTurnoAulaInput')
export class ListTurnoAulaInputType implements SearchRequest, IListTurnoAulaInput {
  @Field(() => String, { nullable: true })
  query!: string;

  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => Int, { nullable: true })
  offset?: number;
}
