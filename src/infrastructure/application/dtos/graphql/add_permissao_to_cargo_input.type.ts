import { Field, InputType } from '@nestjs/graphql';
import { IAddPermissaoToCargoInput } from '../../../../domain/dtos';

@InputType('AddPermissaoToCargoInput')
export class AddPermissaoToCargoInputType implements IAddPermissaoToCargoInput {
  @Field()
  cargoId!: number;

  @Field()
  permissaoId!: number;
}
