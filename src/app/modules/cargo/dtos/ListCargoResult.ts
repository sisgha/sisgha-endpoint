import { Field, ObjectType } from '@nestjs/graphql';
import { CargoType } from '../cargo.type';
import { GenericSearchResultType } from 'src/meilisearch/dtos';

@ObjectType('ListCargoResult')
export class ListCargoResultType extends GenericSearchResultType<CargoType | null> {
  @Field(() => [CargoType], { nullable: 'items' })
  items!: (CargoType | null)[];
}
