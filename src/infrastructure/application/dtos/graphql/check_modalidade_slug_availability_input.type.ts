import { Field, InputType, Int } from '@nestjs/graphql';
import { ICheckModalidadeSlugAvailabilityInput } from '../../../../domain/dtos';

@InputType('CheckModalidadeSlugAvailabilityInput')
export class CheckModalidadeSlugAvailabilityInputType implements ICheckModalidadeSlugAvailabilityInput {
  @Field(() => Int, { nullable: true })
  modalidadeId!: number | null;

  @Field(() => String)
  slug!: string;
}
