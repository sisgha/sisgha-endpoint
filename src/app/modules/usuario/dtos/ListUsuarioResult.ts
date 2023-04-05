import { Field, ObjectType } from '@nestjs/graphql';
import { IGenericSearchResult } from '../../../../common/zod/GenericSearchInputZod';
import { UsuarioType } from '../usuario.type';

@ObjectType('ListUsuarioResult')
export class ListUsuarioResultType
  implements IGenericSearchResult<UsuarioType | null>
{
  @Field(() => String)
  query!: string;

  @Field(() => Number)
  limit!: number;

  @Field(() => Number)
  offset!: number;

  @Field(() => Number)
  total!: number;

  @Field(() => [UsuarioType], { nullable: 'items' })
  items!: (UsuarioType | null)[];
}
