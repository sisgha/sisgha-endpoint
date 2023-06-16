import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';
import { GenericListInputType, GenericListInputZod } from '../../../../meilisearch/dtos';
import { IdZod } from '../../../../common/zod/IdZod';

export const ListPermissaoFromCargoInputZod = GenericListInputZod.extend({
  cargoId: IdZod,
});

export type IListPermissaoFromCargoInput = z.infer<typeof ListPermissaoFromCargoInputZod>;

@InputType('ListPermissaoFromCargoInput')
export class ListPermissaoFromCargoInputType extends GenericListInputType implements IListPermissaoFromCargoInput {
  @Field()
  cargoId!: number;
}
