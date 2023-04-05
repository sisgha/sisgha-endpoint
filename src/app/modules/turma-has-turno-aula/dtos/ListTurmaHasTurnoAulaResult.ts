import { Field, ObjectType } from '@nestjs/graphql';
import { IGenericSearchResult } from '../../../../common/zod/GenericSearchInputZod';
import { TurmaHasTurnoAulaType } from '../turma-has-turno-aula.type';

@ObjectType('ListTurmaHasTurnoAulaResult')
export class ListTurmaHasTurnoAulaResultType
  implements IGenericSearchResult<TurmaHasTurnoAulaType | null>
{
  @Field(() => String)
  query!: string;

  @Field(() => Number)
  limit!: number;

  @Field(() => Number)
  offset!: number;

  @Field(() => Number)
  total!: number;

  @Field(() => [TurmaHasTurnoAulaType], { nullable: 'items' })
  items!: (TurmaHasTurnoAulaType | null)[];
}
