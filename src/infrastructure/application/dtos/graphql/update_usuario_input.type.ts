import { Field, InputType, Int } from '@nestjs/graphql';
import { IUpdateUsuarioInput } from '../../../../domain/dtos';

@InputType('UpdateUsuarioInput')
export class UpdateUsuarioInputType implements IUpdateUsuarioInput {
  @Field(() => Int)
  id!: number;

  @Field(() => String, { nullable: true })
  nome?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  matriculaSiape?: string;
}
