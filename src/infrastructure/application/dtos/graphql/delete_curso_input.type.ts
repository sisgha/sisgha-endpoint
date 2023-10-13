import { Field, InputType, Int } from '@nestjs/graphql';
import { IDeleteCursoInput } from '../../../../domain/dtos';

@InputType('DeleteCursoInput')
export class DeleteCursoInputType implements IDeleteCursoInput {
  @Field(() => Int)
  id!: number;
}
