import { Field, InputType, Int } from '@nestjs/graphql';
import { IGenericListInput } from '../../../../domain/search/IGenericListInput';

@InputType('GenericListInput')
export class GenericListInputType implements IGenericListInput {
  @Field(() => String, { nullable: true })
  query!: string;

  @Field(() => Int, { nullable: true })
  limit!: number;

  @Field(() => Int, { nullable: true })
  offset?: number;

  @Field(() => String, { nullable: true })
  filter?: string;

  @Field(() => [String], { nullable: true })
  sort?: string[];
}
