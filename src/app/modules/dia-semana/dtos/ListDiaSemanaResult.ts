import { Field, ObjectType } from '@nestjs/graphql';
import { DiaSemanaType } from '../dia-semana.type';
import { GenericSearchResultType } from 'src/meilisearch/dtos';

@ObjectType('ListDiaSemanaResult')
export class ListDiaSemanaResultType extends GenericSearchResultType<DiaSemanaType | null> {
  @Field(() => [DiaSemanaType], { nullable: 'items' })
  items!: (DiaSemanaType | null)[];
}
