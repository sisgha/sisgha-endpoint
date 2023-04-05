import { Field, ObjectType } from '@nestjs/graphql';
import { IGenericSearchResult } from '../../../../common/zod/GenericSearchInputZod';
import { AulaType } from '../aula.type';

@ObjectType('ListAulaResult')
export class ListAulaResultType
  implements IGenericSearchResult<AulaType | null>
{
  @Field(() => String)
  query!: string;

  @Field(() => Number)
  limit!: number;

  @Field(() => Number)
  offset!: number;

  @Field(() => Number)
  total!: number;

  @Field(() => [AulaType], { nullable: 'items' })
  items!: (AulaType | null)[];
}
