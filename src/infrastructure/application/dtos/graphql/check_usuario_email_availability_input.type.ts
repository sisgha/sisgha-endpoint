import { Field, InputType, Int } from '@nestjs/graphql';
import { ICheckUsuarioEmailAvailabilityInput } from '../../../../domain/dtos';

@InputType('CheckUsuarioEmailAvailabilityInput')
export class CheckUsuarioEmailAvailabilityInputType implements ICheckUsuarioEmailAvailabilityInput {
  @Field(() => Int, { nullable: true })
  usuarioId!: number | null;

  @Field(() => String)
  email!: string;
}
