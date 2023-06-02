import { Field, ObjectType } from '@nestjs/graphql';

export type GenericSearchResult<T> = {
  query: string;
  limit: number;
  offset: number;
  total: number;
  items: T[];
};

@ObjectType('GenericSearchResult', { isAbstract: true })
export class GenericSearchResultType<T> implements GenericSearchResult<T> {
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
