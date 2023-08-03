import { Field, InputType } from '@nestjs/graphql';
import { ICreateUsuarioInternoInput } from '../../../../domain/dtos';

@InputType('CreateUsuarioInternoInput')
export class CreateUsuarioInternoInputType implements ICreateUsuarioInternoInput {
  @Field()
  tipoEntidade!: string;
}
