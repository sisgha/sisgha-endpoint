import { Field, InputType, Int } from '@nestjs/graphql';
import { IUpdateUsuarioInternoInput } from '../../../../domain/dtos/IUpdateUsuarioInternoInput';

@InputType('UpdateUsuarioInternoInput')
export class UpdateUsuarioInternoInputType implements IUpdateUsuarioInternoInput {
  @Field(() => Int)
  id!: number;

  @Field(() => String, { nullable: true })
  tipoEntidade?: string;
}
