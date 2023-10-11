import { Field, ObjectType } from '@nestjs/graphql';
import { GenericSearchResultType } from './generic_search_result.type';
import { ModalidadeType } from './modalidade.type';

@ObjectType('ListModalidadeResult')
export class ListModalidadeResultType extends GenericSearchResultType<ModalidadeType> {
  @Field(() => [ModalidadeType])
  items!: ModalidadeType[];
}
