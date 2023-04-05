import { Field, ObjectType } from '@nestjs/graphql';
import { TurnoAulaType } from '../turno-aula.type';
import { GenericSearchResultType } from 'src/meilisearch/dtos';

@ObjectType('ListTurnoAulaResult')
export class ListTurnoAulaResultType extends GenericSearchResultType<TurnoAulaType | null> {
  @Field(() => [TurnoAulaType], { nullable: 'items' })
  items!: (TurnoAulaType | null)[];
}
