import { Field, InputType } from '@nestjs/graphql';
import { ICreateModalidadeInput } from '../../../../domain/dtos';

@InputType('CreateModalidadeInput')
export class CreateModalidadeInputType implements ICreateModalidadeInput {
  @Field()
  slug!: string;
}
