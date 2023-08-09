import { Field, InputType } from '@nestjs/graphql';
import { IFindCargoPermissaoByCargoIdAndPermissaoIdInput } from '../../../../domain/dtos';

@InputType('FindCargoPermissaoByCargoIdAndPermissaoIdInput')
export class FindCargoPermissaoByCargoIdAndPermissaoIdInputType implements IFindCargoPermissaoByCargoIdAndPermissaoIdInput {
  @Field()
  cargoId!: number;

  @Field()
  permissaoId!: number;
}
