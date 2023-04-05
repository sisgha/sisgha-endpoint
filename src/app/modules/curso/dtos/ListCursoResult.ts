import { Field, ObjectType } from '@nestjs/graphql';
import { IGenericSearchResult } from '../../../../common/zod/GenericSearchInputZod';
import { CursoType } from '../curso.type';

@ObjectType('ListCursoResult')
export class ListCursoResultType
  implements IGenericSearchResult<CursoType | null>
{
  @Field(() => String)
  query!: string;

  @Field(() => Number)
  limit!: number;

  @Field(() => Number)
  offset!: number;

  @Field(() => Number)
  total!: number;

  @Field(() => [CursoType], { nullable: 'items' })
  items!: (CursoType | null)[];
}
