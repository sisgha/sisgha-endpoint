import { Field, InputType, Int } from '@nestjs/graphql';
import { IFindPermissaoByIdInput } from '../../../../domain/dtos';

@InputType('FindPermissaoByIdInput')
export class FindPermissaoByIdInputType implements IFindPermissaoByIdInput {
  @Field(() => Int)
  id!: number;
}
