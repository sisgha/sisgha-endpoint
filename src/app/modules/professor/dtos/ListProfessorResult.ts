import { Field, ObjectType } from '@nestjs/graphql';
import { ProfessorType } from '../professor.type';
import { GenericSearchResultType } from 'src/meilisearch/dtos';

@ObjectType('ListProfessorResult')
export class ListProfessorResultType extends GenericSearchResultType<ProfessorType | null> {
  @Field(() => [ProfessorType], { nullable: 'items' })
  items!: (ProfessorType | null)[];
}
