import { Field, InputType } from '@nestjs/graphql';
import { IFindUsuarioInternoCargoByIdInput } from '../../../../domain/dtos/IFindUsuarioInternoCargoByIdInput';

@InputType('FindUsuarioInternoCargoByIdInput')
export class FindUsuarioInternoCargoByIdInputType implements IFindUsuarioInternoCargoByIdInput {
  @Field()
  id!: number;
}
