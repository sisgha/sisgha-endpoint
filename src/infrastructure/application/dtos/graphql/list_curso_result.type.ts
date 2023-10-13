import { Field, ObjectType } from '@nestjs/graphql';
import { CursoType } from './curso.type';
import { GenericSearchResultType } from './generic_search_result.type';

@ObjectType('ListCursoResult')
export class ListCursoResultType extends GenericSearchResultType<CursoType> {
  @Field(() => [CursoType])
  items!: CursoType[];
}
