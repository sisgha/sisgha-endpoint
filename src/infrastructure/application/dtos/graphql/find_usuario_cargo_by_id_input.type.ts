import { Field, InputType } from '@nestjs/graphql';
import { IFindUsuarioCargoByIdInput } from '../../../../domain/dtos';

@InputType('FindUsuarioCargoByIdInput')
export class FindUsuarioCargoByIdInputType implements IFindUsuarioCargoByIdInput {
  @Field()
  id!: number;
}
