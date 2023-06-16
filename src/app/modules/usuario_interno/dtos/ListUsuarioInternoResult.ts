import { Field, ObjectType } from '@nestjs/graphql';
import { GenericSearchResultType } from 'src/meilisearch/dtos';
import { UsuarioInternoType } from '../usuario_interno.type';

@ObjectType('ListUsuarioInternoResult')
export class ListUsuarioInternoResultType extends GenericSearchResultType<UsuarioInternoType> {
  @Field(() => [UsuarioInternoType])
  items!: UsuarioInternoType[];
}
