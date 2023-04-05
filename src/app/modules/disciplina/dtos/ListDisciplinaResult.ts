import { Field, ObjectType } from '@nestjs/graphql';
import { IGenericSearchResult } from '../../../../common/zod/GenericSearchInputZod';
import { DisciplinaType } from '../disciplina.type';

@ObjectType('ListDisciplinaResult')
export class ListDisciplinaResultType
  implements IGenericSearchResult<DisciplinaType | null>
{
  @Field(() => String)
  query!: string;

  @Field(() => Number)
  limit!: number;

  @Field(() => Number)
  offset!: number;

  @Field(() => Number)
  total!: number;

  @Field(() => [DisciplinaType], { nullable: 'items' })
  items!: (DisciplinaType | null)[];
}
