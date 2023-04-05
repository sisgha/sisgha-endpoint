import { Field, ObjectType } from '@nestjs/graphql';
import { IGenericSearchResult } from '../../../../common/zod/GenericSearchInputZod';
import { DiaSemanaType } from '../dia-semana.type';

@ObjectType('ListDiaSemanaResult')
export class ListDiaSemanaResultType
  implements IGenericSearchResult<DiaSemanaType | null>
{
  @Field(() => String)
  query!: string;

  @Field(() => Number)
  limit!: number;

  @Field(() => Number)
  offset!: number;

  @Field(() => Number)
  total!: number;

  @Field(() => [DiaSemanaType], { nullable: 'items' })
  items!: (DiaSemanaType | null)[];
}
