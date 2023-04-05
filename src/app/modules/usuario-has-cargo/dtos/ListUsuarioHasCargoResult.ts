import { Field, ObjectType } from '@nestjs/graphql';
import { IGenericSearchResult } from '../../../../common/zod/GenericSearchInputZod';
import { UsuarioHasCargoType } from '../usuario-has-cargo.type';

@ObjectType('ListUsuarioHasCargoResult')
export class ListUsuarioHasCargoResultType
  implements IGenericSearchResult<UsuarioHasCargoType | null>
{
  @Field(() => String)
  query!: string;

  @Field(() => Number)
  limit!: number;

  @Field(() => Number)
  offset!: number;

  @Field(() => Number)
  total!: number;

  @Field(() => [UsuarioHasCargoType], { nullable: 'items' })
  items!: (UsuarioHasCargoType | null)[];
}
