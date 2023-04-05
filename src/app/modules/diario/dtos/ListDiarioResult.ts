import { Field, ObjectType } from '@nestjs/graphql';
import { IGenericSearchResult } from '../../../../common/zod/GenericSearchInputZod';
import { DiarioType } from '../diario.type';

@ObjectType('ListDiarioResult')
export class ListDiarioResultType
  implements IGenericSearchResult<DiarioType | null>
{
  @Field(() => String)
  query!: string;

  @Field(() => Number)
  limit!: number;

  @Field(() => Number)
  offset!: number;

  @Field(() => Number)
  total!: number;

  @Field(() => [DiarioType], { nullable: 'items' })
  items!: (DiarioType | null)[];
}
