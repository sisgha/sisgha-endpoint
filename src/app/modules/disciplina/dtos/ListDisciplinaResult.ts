import { Field, ObjectType } from '@nestjs/graphql';
import { DisciplinaType } from '../disciplina.type';
import { GenericSearchResultType } from 'src/meilisearch/dtos';

@ObjectType('ListDisciplinaResult')
export class ListDisciplinaResultType extends GenericSearchResultType<DisciplinaType | null> {
  @Field(() => [DisciplinaType], { nullable: 'items' })
  items!: (DisciplinaType | null)[];
}
