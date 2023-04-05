import { Field, ObjectType } from '@nestjs/graphql';
import { DiarioType } from '../diario.type';
import { GenericSearchResultType } from 'src/meilisearch/dtos';

@ObjectType('ListDiarioResult')
export class ListDiarioResultType extends GenericSearchResultType<DiarioType | null> {
  @Field(() => [DiarioType], { nullable: 'items' })
  items!: (DiarioType | null)[];
}
