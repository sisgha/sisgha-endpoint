import { Field, InputType, Int } from '@nestjs/graphql';
import { IDeleteUsuarioInput } from '../../../../domain/dtos';

@InputType('DeleteUsuarioInput')
export class DeleteUsuarioInputType implements IDeleteUsuarioInput {
  @Field(() => Int)
  id!: number;
}
