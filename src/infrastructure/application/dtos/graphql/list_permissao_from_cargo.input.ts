import { Field, InputType } from '@nestjs/graphql';
import { IListPermissaoFromCargoInput } from '../../../../domain/dtos';
import { GenericListInputType } from './generic_list_input.type';

@InputType('ListPermissaoFromCargoInput')
export class ListPermissaoFromCargoInputType extends GenericListInputType implements IListPermissaoFromCargoInput {
  @Field()
  cargoId!: number;
}
