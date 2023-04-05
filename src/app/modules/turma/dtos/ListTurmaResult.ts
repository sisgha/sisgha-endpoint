import { Field, ObjectType } from '@nestjs/graphql';
import { IGenericSearchResult } from '../../../../common/zod/GenericSearchInputZod';
import { TurmaType } from '../turma.type';

@ObjectType('ListTurmaResult')
export class ListTurmaResultType
  implements IGenericSearchResult<TurmaType | null>
{
  @Field(() => String)
  query!: string;

  @Field(() => Number)
  limit!: number;

  @Field(() => Number)
  offset!: number;

  @Field(() => Number)
  total!: number;

  @Field(() => [TurmaType], { nullable: 'items' })
  items!: (TurmaType | null)[];
}
