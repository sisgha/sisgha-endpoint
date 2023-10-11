import { Field, InputType, Int } from '@nestjs/graphql';
import { IDeleteModalidadeInput } from '../../../../domain/dtos';

@InputType('DeleteModalidadeInput')
export class DeleteModalidadeInputType implements IDeleteModalidadeInput {
  @Field(() => Int)
  id!: number;
}
