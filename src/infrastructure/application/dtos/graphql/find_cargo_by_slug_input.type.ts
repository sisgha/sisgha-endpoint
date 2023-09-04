import { Field, InputType } from '@nestjs/graphql';
import { IFindCargoBySlugInput } from '../../../../domain/dtos';

@InputType('FindCargoBySlugInput')
export class FindCargoBySlugInputType implements IFindCargoBySlugInput {
  @Field(() => String)
  slug!: string;
}
