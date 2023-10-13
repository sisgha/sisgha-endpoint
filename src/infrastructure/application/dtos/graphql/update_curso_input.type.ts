import { Field, InputType, Int } from '@nestjs/graphql';
import { IUpdateCursoInput } from '../../../../domain/dtos';

@InputType('UpdateCursoInput')
export class UpdateCursoInputType implements IUpdateCursoInput {
  @Field(() => Int)
  id!: number;

  @Field(() => String, { nullable: true })
  nome?: string;

  @Field(() => String, { nullable: true })
  nomeAbreviado?: string;

  @Field(() => Int, { nullable: true })
  modalidadeId?: number;
}
