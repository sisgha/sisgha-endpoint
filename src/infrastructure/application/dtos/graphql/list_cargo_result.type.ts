import { Field, ObjectType } from '@nestjs/graphql';
import { CargoType } from './cargo.type';
import { GenericSearchResultType } from './generic_search_result.type';

@ObjectType('ListCargoResult')
export class ListCargoResultType extends GenericSearchResultType<CargoType> {
  @Field(() => [CargoType])
  items!: CargoType[];
}
