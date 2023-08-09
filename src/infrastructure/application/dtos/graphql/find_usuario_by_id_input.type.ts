import { Field, InputType, Int } from '@nestjs/graphql';
import { IFindUsuarioByIdInput } from '../../../../domain/dtos';

@InputType('FindUsuarioByIdInput')
export class FindUsuarioByIdInputType implements IFindUsuarioByIdInput {
  @Field(() => Int)
  id!: number;
}
