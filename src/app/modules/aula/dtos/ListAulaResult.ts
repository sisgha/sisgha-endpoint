import { Field, ObjectType } from '@nestjs/graphql';
import { GenericSearchResultType } from 'src/meilisearch/dtos/GenericSearchResult';
import { AulaType } from '../aula.type';

@ObjectType('ListAulaResult')
export class ListAulaResultType extends GenericSearchResultType<AulaType | null> {
  @Field(() => [AulaType], { nullable: 'items' })
  items!: (AulaType | null)[];
}
