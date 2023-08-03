import { Field, InputType } from '@nestjs/graphql';
import { GenericListInputType } from './generic_list_input.type';
import { IListCargoFromUsuarioInput } from '../../../../domain/dtos';

@InputType('ListCargoFromUsuarioInput')
export class ListCargoFromUsuarioInputType extends GenericListInputType implements IListCargoFromUsuarioInput {
  @Field()
  usuarioId!: number;
}
