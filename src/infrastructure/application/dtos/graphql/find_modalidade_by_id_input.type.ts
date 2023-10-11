import { Field, InputType, Int } from '@nestjs/graphql';
import { IFindModalidadeByIdInput } from '../../../../domain/dtos';

@InputType('FindModalidadeByIdInput')
export class FindModalidadeByIdInputType implements IFindModalidadeByIdInput {
  @Field(() => Int)
  id!: number;
}
