import { Field, ObjectType } from '@nestjs/graphql';
import { GenericSearchResultType } from 'src/meilisearch/dtos';
import { CargoType } from '../cargo.type';

@ObjectType('ListCargoResult')
export class ListCargoResultType extends GenericSearchResultType<CargoType> {
  @Field(() => [CargoType])
  items!: CargoType[];
}
