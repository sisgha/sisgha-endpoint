import { Field, ObjectType } from '@nestjs/graphql';
import { IGenericSearchResult } from '../../../../common/zod/GenericSearchInputZod';
import { TurnoAulaType } from '../turno-aula.type';

@ObjectType('ListTurnoAulaResult')
export class ListTurnoAulaResultType
  implements IGenericSearchResult<TurnoAulaType | null>
{
  @Field(() => String)
  query!: string;

  @Field(() => Number)
  limit!: number;

  @Field(() => Number)
  offset!: number;

  @Field(() => Number)
  total!: number;

  @Field(() => [TurnoAulaType], { nullable: 'items' })
  items!: (TurnoAulaType | null)[];
}
