import { Field, InputType, Int } from '@nestjs/graphql';
import { SearchRequest } from 'src/common/interfaces/SearchRequest';
import { z } from 'zod';
import { GenericSearchInputZod } from '../../../../common/zod/GenericSearchInputZod';

export const ListUsuarioHasCargoInputZod = GenericSearchInputZod;

export type IListUsuarioHasCargoInput = z.infer<typeof ListUsuarioHasCargoInputZod>;

@InputType('ListUsuarioHasCargoInput')
export class ListUsuarioHasCargoInputType implements SearchRequest, IListUsuarioHasCargoInput {
  @Field(() => String, { nullable: true })
  query!: string;

  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => Int, { nullable: true })
  offset?: number;
}
