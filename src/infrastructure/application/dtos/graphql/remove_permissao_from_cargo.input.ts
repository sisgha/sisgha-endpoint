import { Field, InputType } from '@nestjs/graphql';
import { IRemovePermissaoFromCargoInput } from '../../../../domain/dtos';

@InputType('RemovePermissaoFromCargoInput')
export class RemovePermissaoFromCargoInputType implements IRemovePermissaoFromCargoInput {
  @Field()
  cargoId!: number;

  @Field()
  permissaoId!: number;
}
