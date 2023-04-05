import { Field, ObjectType } from '@nestjs/graphql';
import { PeriodoDiaType } from '../periodo-dia.type';
import { GenericSearchResultType } from 'src/meilisearch/dtos';

@ObjectType('ListPeriodoDiaResult')
export class ListPeriodoDiaResultType extends GenericSearchResultType<PeriodoDiaType | null> {
  @Field(() => [PeriodoDiaType], { nullable: 'items' })
  items!: (PeriodoDiaType | null)[];
}
