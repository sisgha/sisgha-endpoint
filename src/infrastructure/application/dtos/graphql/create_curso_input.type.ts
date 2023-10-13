import { Field, InputType, Int } from '@nestjs/graphql';
import { ICreateCursoInput } from '../../../../domain/dtos';

@InputType('CreateCursoInput')
export class CreateCursoInputType implements ICreateCursoInput {
  @Field(() => String)
  nome!: string;

  @Field(() => String)
  nomeAbreviado!: string;

  @Field(() => Int)
  modalidadeId!: number;
}
