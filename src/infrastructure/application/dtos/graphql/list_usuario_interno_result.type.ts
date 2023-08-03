import { Field, ObjectType } from '@nestjs/graphql';
import { UsuarioInternoType } from './usuario_interno.type';
import { GenericSearchResultType } from './generic_search_result.type';
import { IListUsuarioInternoResult } from '../../../../domain/dtos/IListUsuarioInternoResult';

@ObjectType('ListUsuarioInternoResult')
export class ListUsuarioInternoResultType extends GenericSearchResultType<UsuarioInternoType> implements IListUsuarioInternoResult {
  @Field(() => [UsuarioInternoType])
  items!: UsuarioInternoType[];
}
