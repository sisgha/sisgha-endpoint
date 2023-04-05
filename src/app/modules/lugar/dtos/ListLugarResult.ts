import { Field, ObjectType } from '@nestjs/graphql';
import { IGenericSearchResult } from '../../../../common/zod/GenericSearchInputZod';
import { LugarType } from '../lugar.type';

@ObjectType('ListLugarResult')
export class ListLugarResultType
  implements IGenericSearchResult<LugarType | null>
{
  @Field(() => String)
  query!: string;

  @Field(() => Number)
  limit!: number;

  @Field(() => Number)
  offset!: number;

  @Field(() => Number)
  total!: number;

  @Field(() => [LugarType], { nullable: 'items' })
  items!: (LugarType | null)[];
}
