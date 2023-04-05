import { Field, InputType, Int } from '@nestjs/graphql';
import { SearchRequest } from 'src/common/interfaces/SearchRequest';
import { z } from 'zod';
import { GenericSearchInputZod } from '../../../../common/zod/GenericSearchInputZod';

export const ListTurmaHasTurnoAulaInputZod = GenericSearchInputZod;

export type IListTurmaHasTurnoAulaInput = z.infer<typeof ListTurmaHasTurnoAulaInputZod>;

@InputType('ListTurmaHasTurnoAulaInput')
export class ListTurmaHasTurnoAulaInputType implements SearchRequest, IListTurmaHasTurnoAulaInput {
  @Field(() => String, { nullable: true })
  query!: string;

  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => Int, { nullable: true })
  offset?: number;
}
