import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';
import { IdZod } from '../../../../common/zod/IdZod';
import { GenericListInputType, GenericListInputZod } from '../../../../meilisearch/dtos';

export const ListCargoFromUsuarioInternoInputZod = GenericListInputZod.extend({
  usuarioInternoId: IdZod,
});

export type IListCargoFromUsuarioInternoInput = z.infer<typeof ListCargoFromUsuarioInternoInputZod>;

@InputType('ListCargoFromUsuarioInternoInput')
export class ListCargoFromUsuarioInternoInputType extends GenericListInputType implements IListCargoFromUsuarioInternoInput {
  @Field()
  usuarioInternoId!: number;
}
