import { Field, InputType, Int } from '@nestjs/graphql';
import { IDeletePermissaoInput } from '../../../../domain/dtos';

@InputType('DeletePermissaoInput')
export class DeletePermissaoInputType implements IDeletePermissaoInput {
  @Field(() => Int)
  id!: number;
}
