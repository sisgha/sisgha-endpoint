import { Field, InputType, Int } from '@nestjs/graphql';
import { IDeleteUsuarioInternoInput } from '../../../../domain/dtos';

@InputType('DeleteUsuarioInternoInput')
export class DeleteUsuarioInternoInputType implements IDeleteUsuarioInternoInput {
  @Field(() => Int)
  id!: number;
}
