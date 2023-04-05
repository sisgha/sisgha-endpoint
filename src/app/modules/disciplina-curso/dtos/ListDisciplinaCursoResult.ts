import { Field, ObjectType } from '@nestjs/graphql';
import { DisciplinaCursoType } from '../disciplina-curso.type';
import { GenericSearchResultType } from 'src/meilisearch/dtos';

@ObjectType('ListDisciplinaCursoResult')
export class ListDisciplinaCursoResultType extends GenericSearchResultType<DisciplinaCursoType | null> {
  @Field(() => [DisciplinaCursoType], { nullable: 'items' })
  items!: (DisciplinaCursoType | null)[];
}
