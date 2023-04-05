import { Field, ObjectType } from '@nestjs/graphql';
import { UsuarioHasCargoType } from '../usuario-has-cargo.type';
import { GenericSearchResultType } from 'src/meilisearch/dtos';

@ObjectType('ListUsuarioHasCargoResult')
export class ListUsuarioHasCargoResultType extends GenericSearchResultType<UsuarioHasCargoType | null> {
  @Field(() => [UsuarioHasCargoType], { nullable: 'items' })
  items!: (UsuarioHasCargoType | null)[];
}
