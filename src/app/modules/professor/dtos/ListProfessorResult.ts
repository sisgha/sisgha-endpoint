import { Field, ObjectType } from '@nestjs/graphql';
import { IGenericSearchResult } from '../../../../common/zod/GenericSearchInputZod';
import { ProfessorType } from '../professor.type';

@ObjectType('ListProfessorResult')
export class ListProfessorResultType
  implements IGenericSearchResult<ProfessorType | null>
{
  @Field(() => String)
  query!: string;

  @Field(() => Number)
  limit!: number;

  @Field(() => Number)
  offset!: number;

  @Field(() => Number)
  total!: number;

  @Field(() => [ProfessorType], { nullable: 'items' })
  items!: (ProfessorType | null)[];
}
