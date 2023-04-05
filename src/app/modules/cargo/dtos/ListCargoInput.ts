import { Field, InputType, Int } from '@nestjs/graphql';
import { SearchRequest } from 'src/common/interfaces/SearchRequest';
import { z } from 'zod';
import { GenericSearchInputZod } from '../../../../common/zod/GenericSearchInputZod';

export const ListCargoInputZod = GenericSearchInputZod;

export type IListCargoInput = z.infer<typeof ListCargoInputZod>;

@InputType('ListCargoInput')
export class ListCargoInputType implements SearchRequest, IListCargoInput {
  @Field(() => String, { nullable: true })
  query!: string;

  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => Int, { nullable: true })
  offset?: number;
}
