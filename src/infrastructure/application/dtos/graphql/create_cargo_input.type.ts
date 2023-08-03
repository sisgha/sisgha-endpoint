import { Field, InputType } from '@nestjs/graphql';
import { ICreateCargoInput } from '../../../../domain/dtos';

@InputType('CreateCargoInput')
export class CreateCargoInputType implements ICreateCargoInput {
  @Field()
  slug!: string;
}
