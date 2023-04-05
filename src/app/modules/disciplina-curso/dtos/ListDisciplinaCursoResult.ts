import { Field, ObjectType } from '@nestjs/graphql';
import { IGenericSearchResult } from '../../../../common/zod/GenericSearchInputZod';
import { DisciplinaCursoType } from '../disciplina-curso.type';

@ObjectType('ListDisciplinaCursoResult')
export class ListDisciplinaCursoResultType
  implements IGenericSearchResult<DisciplinaCursoType | null>
{
  @Field(() => String)
  query!: string;

  @Field(() => Number)
  limit!: number;

  @Field(() => Number)
  offset!: number;

  @Field(() => Number)
  total!: number;

  @Field(() => [DisciplinaCursoType], { nullable: 'items' })
  items!: (DisciplinaCursoType | null)[];
}
