import { Field, InputType, Int } from '@nestjs/graphql';
import { ICheckCargoSlugAvailabilityInput } from '../../../../domain/dtos';

@InputType('CheckCargoSlugAvailabilityInput')
export class CheckCargoSlugAvailabilityInputType implements ICheckCargoSlugAvailabilityInput {
  @Field(() => Int, { nullable: true })
  cargoId!: number | null;

  @Field(() => String)
  slug!: string;
}
