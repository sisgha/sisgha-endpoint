import { Field, ObjectType } from '@nestjs/graphql';
import { CursoType } from '../curso.type';
import { GenericSearchResultType } from 'src/meilisearch/dtos';

@ObjectType('ListCursoResult')
export class ListCursoResultType extends GenericSearchResultType<CursoType | null> {
  @Field(() => [CursoType], { nullable: 'items' })
  items!: (CursoType | null)[];
}
