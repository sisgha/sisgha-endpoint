import { Field, ObjectType } from '@nestjs/graphql';
import { LugarType } from '../lugar.type';
import { GenericSearchResultType } from 'src/meilisearch/dtos';

@ObjectType('ListLugarResult')
export class ListLugarResultType extends GenericSearchResultType<LugarType | null> {
  @Field(() => [LugarType], { nullable: 'items' })
  items!: (LugarType | null)[];
}
