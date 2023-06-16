import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';
import { IdZod } from '../../../../common/zod/IdZod';
import { GenericListInputType, GenericListInputZod } from '../../../../meilisearch/dtos';

export const ListCargoFromUsuarioInputZod = GenericListInputZod.extend({
  usuarioId: IdZod,
});

export type IListCargoFromUsuarioInput = z.infer<typeof ListCargoFromUsuarioInputZod>;

@InputType('ListCargoFromUsuarioInput')
export class ListCargoFromUsuarioInputType extends GenericListInputType implements IListCargoFromUsuarioInput {
  @Field()
  usuarioId!: number;
}
