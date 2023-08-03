import { Field, ObjectType } from '@nestjs/graphql';
import { PermissaoType } from './permissao.type';
import { GenericSearchResultType } from './generic_search_result.type';

@ObjectType('ListPermissaoResult')
export class ListPermissaoResultType extends GenericSearchResultType<PermissaoType> {
  @Field(() => [PermissaoType])
  items!: PermissaoType[];
}
