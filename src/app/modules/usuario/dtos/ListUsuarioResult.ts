import { Field, ObjectType } from '@nestjs/graphql';
import { UsuarioType } from '../usuario.type';
import { GenericSearchResultType } from 'src/meilisearch/dtos';

@ObjectType('ListUsuarioResult')
export class ListUsuarioResultType extends GenericSearchResultType<UsuarioType | null> {
  @Field(() => [UsuarioType], { nullable: 'items' })
  items!: (UsuarioType | null)[];
}
