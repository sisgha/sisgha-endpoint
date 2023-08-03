import { Field, ObjectType } from '@nestjs/graphql';
import { IGenericSearchResult } from '../../../../domain/dtos';

@ObjectType('GenericSearchResult', { isAbstract: true })
export class GenericSearchResultType<T> implements IGenericSearchResult<T> {
  @Field(() => String)
  query!: string;

  @Field(() => Number)
  limit!: number;

  @Field(() => Number)
  offset!: number;

  @Field(() => Number)
  total!: number;

  items!: T[];
}
