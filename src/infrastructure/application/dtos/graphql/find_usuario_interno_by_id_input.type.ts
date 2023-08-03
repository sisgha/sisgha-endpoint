import { Field, InputType, Int } from '@nestjs/graphql';
import { IFindUsuarioInternoByIdInput } from '../../../../domain/dtos/IFindUsuarioInternoByIdInput';

@InputType('FindUsuarioInternoByIdInput')
export class FindUsuarioInternoByIdInputType implements IFindUsuarioInternoByIdInput {
  @Field(() => Int)
  id!: number;
}
