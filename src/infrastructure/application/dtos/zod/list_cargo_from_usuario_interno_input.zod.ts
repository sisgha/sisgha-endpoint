import { GenericListInputZod } from './generic_list_input.zod';
import { IdZod } from './literals/id.zod';

export const ListCargoFromUsuarioInternoInputZod = GenericListInputZod.extend({
  usuarioInternoId: IdZod,
});
