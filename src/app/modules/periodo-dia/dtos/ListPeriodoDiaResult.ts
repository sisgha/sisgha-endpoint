import { Field, ObjectType } from '@nestjs/graphql';
import { IGenericSearchResult } from '../../../../common/zod/GenericSearchInputZod';
import { PeriodoDiaType } from '../periodo-dia.type';

@ObjectType('ListPeriodoDiaResult')
export class ListPeriodoDiaResultType
  implements IGenericSearchResult<PeriodoDiaType | null>
{
  @Field(() => String)
  query!: string;

  @Field(() => Number)
  limit!: number;

  @Field(() => Number)
  offset!: number;

  @Field(() => Number)
  total!: number;

  @Field(() => [PeriodoDiaType], { nullable: 'items' })
  items!: (PeriodoDiaType | null)[];
}
