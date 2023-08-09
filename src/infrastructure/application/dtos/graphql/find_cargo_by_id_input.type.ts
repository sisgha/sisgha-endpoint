import { Field, InputType, Int } from '@nestjs/graphql';
import { IFindCargoByIdInput } from '../../../../domain/dtos';

@InputType('FindCargoByIdInput')
export class FindCargoByIdInputType implements IFindCargoByIdInput {
  @Field(() => Int)
  id!: number;
}
