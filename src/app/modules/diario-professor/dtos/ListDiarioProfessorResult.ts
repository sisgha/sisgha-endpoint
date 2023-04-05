import { Field, ObjectType } from '@nestjs/graphql';
import { IGenericSearchResult } from '../../../../common/zod/GenericSearchInputZod';
import { DiarioProfessorType } from '../diario-professor.type';

@ObjectType('ListDiarioProfessorResult')
export class ListDiarioProfessorResultType
  implements IGenericSearchResult<DiarioProfessorType | null>
{
  @Field(() => String)
  query!: string;

  @Field(() => Number)
  limit!: number;

  @Field(() => Number)
  offset!: number;

  @Field(() => Number)
  total!: number;

  @Field(() => [DiarioProfessorType], { nullable: 'items' })
  items!: (DiarioProfessorType | null)[];
}
