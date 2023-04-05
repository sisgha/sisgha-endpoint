import { Field, ObjectType } from '@nestjs/graphql';
import { DiarioProfessorType } from '../diario-professor.type';
import { GenericSearchResultType } from 'src/meilisearch/dtos';

@ObjectType('ListDiarioProfessorResult')
export class ListDiarioProfessorResultType extends GenericSearchResultType<DiarioProfessorType | null> {
  @Field(() => [DiarioProfessorType], { nullable: 'items' })
  items!: (DiarioProfessorType | null)[];
}
