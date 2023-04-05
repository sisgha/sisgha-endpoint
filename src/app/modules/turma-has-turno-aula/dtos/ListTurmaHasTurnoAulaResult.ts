import { Field, ObjectType } from '@nestjs/graphql';
import { TurmaHasTurnoAulaType } from '../turma-has-turno-aula.type';
import { GenericSearchResultType } from 'src/meilisearch/dtos';

@ObjectType('ListTurmaHasTurnoAulaResult')
export class ListTurmaHasTurnoAulaResultType extends GenericSearchResultType<TurmaHasTurnoAulaType | null> {
  @Field(() => [TurmaHasTurnoAulaType], { nullable: 'items' })
  items!: (TurmaHasTurnoAulaType | null)[];
}
