import { Field, InputType, Int } from '@nestjs/graphql';
import { ICheckUsuarioMatriculaSiapeAvailabilityInput } from '../../../../domain/dtos';

@InputType('CheckUsuarioMatriculaSiapeAvailabilityInput')
export class CheckUsuarioMatriculaSiapeAvailabilityInputType implements ICheckUsuarioMatriculaSiapeAvailabilityInput {
  @Field(() => Int, { nullable: true })
  usuarioId!: number | null;

  @Field(() => String)
  matriculaSiape!: string;
}
