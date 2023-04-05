import { Field, ObjectType } from '@nestjs/graphql';
import { TurmaType } from '../turma.type';
import { GenericSearchResultType } from 'src/meilisearch/dtos';

@ObjectType('ListTurmaResult')
export class ListTurmaResultType extends GenericSearchResultType<TurmaType | null> {
  @Field(() => [TurmaType], { nullable: 'items' })
  items!: (TurmaType | null)[];
}
