import { Field, ObjectType } from '@nestjs/graphql';
import { GenericSearchResultType } from 'src/meilisearch/dtos';
import { PermissaoType } from '../permissao.type';

@ObjectType('ListPermissaoResult')
export class ListPermissaoResultType extends GenericSearchResultType<PermissaoType | null> {
  @Field(() => [PermissaoType], { nullable: 'items' })
  items!: PermissaoType[];
}
