import { Field, InputType } from '@nestjs/graphql';
import { ICreateUsuarioInput } from '../../../../domain/dtos';

@InputType('CreateUsuarioInput')
export class CreateUsuarioInputType implements ICreateUsuarioInput {
  @Field()
  email!: string;

  @Field({ nullable: true })
  matriculaSiape?: string;
}
