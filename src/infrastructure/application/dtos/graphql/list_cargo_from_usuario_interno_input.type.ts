import { Field, InputType } from '@nestjs/graphql';
import { GenericListInputType } from './generic_list_input.type';
import { IListCargoFromUsuarioInternoInput } from '../../../../domain/dtos/IListCargoFromUsuarioInternoInput';

@InputType('ListCargoFromUsuarioInternoInput')
export class ListCargoFromUsuarioInternoInputType extends GenericListInputType implements IListCargoFromUsuarioInternoInput {
  @Field()
  usuarioInternoId!: number;
}
