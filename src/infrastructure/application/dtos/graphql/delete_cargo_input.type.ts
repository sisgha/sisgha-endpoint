import { Field, InputType, Int } from '@nestjs/graphql';
import { IDeleteCargoInput } from '../../../../domain/dtos';

@InputType('DeleteCargoInput')
export class DeleteCargoInputType implements IDeleteCargoInput {
  @Field(() => Int)
  id!: number;
}
