import { Field, InputType, Int } from '@nestjs/graphql';
import { IUpdateCargoInput } from '../../../../domain/dtos';

@InputType('UpdateCargoInput')
export class UpdateCargoInputType implements IUpdateCargoInput {
  @Field(() => Int)
  id!: number;

  // ...

  @Field({ nullable: true })
  slug?: string;
}
