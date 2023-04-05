import { Field, ObjectType } from '@nestjs/graphql';
import { IGenericSearchResult } from '../../../../common/zod/GenericSearchInputZod';
import { CargoType } from '../cargo.type';

@ObjectType('ListCargoResult')
export class ListCargoResultType
  implements IGenericSearchResult<CargoType | null>
{
  @Field(() => String)
  query!: string;

  @Field(() => Number)
  limit!: number;

  @Field(() => Number)
  offset!: number;

  @Field(() => Number)
  total!: number;

  @Field(() => [CargoType], { nullable: 'items' })
  items!: (CargoType | null)[];
}
