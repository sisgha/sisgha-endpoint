import { Field, ObjectType } from '@nestjs/graphql';
import { SemanaType } from '../semana.type';
import { GenericSearchResultType } from 'src/meilisearch/dtos';

@ObjectType('ListSemanaResult')
export class ListSemanaResultType extends GenericSearchResultType<SemanaType | null> {
  @Field(() => [SemanaType], { nullable: 'items' })
  items!: (SemanaType | null)[];
}
