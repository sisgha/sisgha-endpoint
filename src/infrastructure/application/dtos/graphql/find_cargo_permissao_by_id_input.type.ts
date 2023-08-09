import { Field, InputType } from '@nestjs/graphql';
import { IFindCargoPermissaoByIdInput } from '../../../../domain/dtos';

@InputType('FindCargoPermissaoByIdInput')
export class FindCargoPermissaoByIdInputType implements IFindCargoPermissaoByIdInput {
  @Field()
  id!: number;
}
