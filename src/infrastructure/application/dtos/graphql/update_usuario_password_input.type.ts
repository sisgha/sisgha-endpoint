import { Field, InputType, Int } from '@nestjs/graphql';
import { IUpdateUsuarioPasswordInput } from '../../../../domain/dtos';

@InputType('UpdateUsuarioPasswordInput')
export class UpdateUsuarioPasswordInputType implements IUpdateUsuarioPasswordInput {
  @Field(() => Int)
  id!: number;

  @Field(() => String, { nullable: false })
  currentPassword!: string;

  @Field(() => String, { nullable: false })
  newPassword!: string;

  @Field(() => String, { nullable: false })
  confirmNewPassword!: string;
}
