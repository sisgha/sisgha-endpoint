import { IGenericListInput } from '../search/IGenericListInput';

export type IListCargoFromUsuarioInput = IGenericListInput & {
  usuarioId: number;
};
