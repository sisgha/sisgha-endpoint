import { Field, ObjectType } from '@nestjs/graphql';
import { GenericSearchResultType } from './generic_search_result.type';
import { UsuarioType } from './usuario.type';

@ObjectType('ListUsuarioResult')
export class ListUsuarioResultType extends GenericSearchResultType<UsuarioType> {
  @Field(() => [UsuarioType])
  items!: UsuarioType[];
}
