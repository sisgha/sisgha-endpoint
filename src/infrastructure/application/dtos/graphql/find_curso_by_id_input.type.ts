import { Field, InputType, Int } from '@nestjs/graphql';
import { IFindCursoByIdInput } from '../../../../domain/dtos';

@InputType('FindCursoByIdInput')
export class FindCursoByIdInputType implements IFindCursoByIdInput {
  @Field(() => Int)
  id!: number;
}
