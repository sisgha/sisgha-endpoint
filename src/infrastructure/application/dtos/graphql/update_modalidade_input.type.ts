import { Field, InputType, Int } from '@nestjs/graphql';
import { IUpdateModalidadeInput } from '../../../../domain/dtos';

@InputType('UpdateModalidadeInput')
export class UpdateModalidadeInputType implements IUpdateModalidadeInput {
  @Field(() => Int)
  id!: number;

  // ...

  @Field({ nullable: true })
  slug?: string;
}
