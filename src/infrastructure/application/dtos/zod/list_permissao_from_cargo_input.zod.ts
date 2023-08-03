import { IdZod } from './literals/id.zod';
import { GenericListInputZod } from './generic_list_input.zod';

export const ListPermissaoFromCargoInputZod = GenericListInputZod.extend({
  cargoId: IdZod,
});
