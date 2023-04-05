import { Field, ObjectType } from '@nestjs/graphql';
import { IGenericSearchResult } from '../../../../common/zod/GenericSearchInputZod';
import { SemanaType } from '../semana.type';

@ObjectType('ListSemanaResult')
export class ListSemanaResultType
  implements IGenericSearchResult<SemanaType | null>
{
  @Field(() => String)
  query!: string;

  @Field(() => Number)
  limit!: number;

  @Field(() => Number)
  offset!: number;

  @Field(() => Number)
  total!: number;

  @Field(() => [SemanaType], { nullable: 'items' })
  items!: (SemanaType | null)[];
}
